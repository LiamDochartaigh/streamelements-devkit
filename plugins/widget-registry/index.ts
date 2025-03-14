import fs from 'node:fs/promises';
import path from 'node:path';
import type { Assets, WidgetRegistryOptions } from './types';

export default function widgetRegistry(options: WidgetRegistryOptions = {
  modulesDir: 'src/widgets',
  outputFile: 'src/widget-registry.ts',
  fileExtensions: {
    js: ['.js'],
    css: ['.css',],
    template: ['.html',],
    fields: ['.json',],
  }
}) {
  const { modulesDir, outputFile, fileExtensions } = options;
  return {
    name: 'widget-registry',

    async buildStart() {
      try {
        const modulesFolderPath = path.resolve(modulesDir);
        const moduleFolders = await fs.readdir(modulesFolderPath, { withFileTypes: true });

        const modules: string[] = [];
        const imports: string[] = [];

        const folderFilter = ['.git']

        // Turn folders into modules
        for (const folder of moduleFolders) {         
          if (!folder.isDirectory() || folderFilter.includes(folder.name)) continue;

          const moduleName = folder.name;
          const modulePath = path.join(modulesFolderPath, moduleName);
          const moduleFiles = await fs.readdir(modulePath);

          const assets: Assets = {};
          let config;

          for (const file of moduleFiles) {
            const extension = path.extname(file);

            for (const [assetType, validExtensions] of Object.entries(fileExtensions)) {
              if (validExtensions.includes(extension)) {
                const importPath = path.join('@/widgets', moduleName, file)
                  .replace(/\\/g, '/');
                const newImport = generateImport({ filePath: importPath, type: assetType, raw: true });
                assets[assetType] = `${newImport.name}`;
                imports.push(newImport.statement);
                break;
              }
              else if (extension === '.ts') {
                const importPath = path.join('@/widgets', moduleName, file)
                  .replace(/\\/g, '/').replace(/\.ts$/g, '');;
                  
                const newImport = generateImport({ filePath: importPath, type: 'ts', raw: false });
                config = newImport.name;
                imports.push(newImport.statement);
                break;
              }
            }
          }

          modules.push(JSON.stringify({
            name: moduleName,
            assets,
            config,
          }, null, 2));
        }

        const assetsReg = new RegExp(`(${Object.keys(fileExtensions).concat('config').join('|')}):\\s*['"](.+?)['"]`, 'g');
        let stringifyWidgets = modules.join(',\n').replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, '$1:');
        stringifyWidgets = stringifyWidgets.replace(assetsReg, '$1: $2');

        // Generate the TypeScript file content
        const content = `// Auto-generated module registry
// Generated on ${new Date().toISOString()}

${imports.join('\n')}

export const widgets = [
${stringifyWidgets}
];`;

        // Ensure output directory exists
        const outputDir = path.dirname(outputFile);
        await fs.mkdir(outputDir, { recursive: true });

        // Write the file
        await fs.writeFile(outputFile, content, 'utf-8');

        console.log(`Module registry generated at ${outputFile} with ${modules.length} modules`);
      } catch (error) {
        console.error('Error generating module registry:', error);
      }
    }
  };
}

function generateImport({ filePath, type, raw }: { filePath: string, type: string, raw?: boolean }) {

  const pathParts = filePath.split('/');
  const widgetName = pathParts[pathParts.length - 2] || 'unknown';

  const sanitizedWidgetName = widgetName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/_{2,}/g, '_');

  const fileName = pathParts[pathParts.length - 1].split('.')[0];
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_]/g, '_');

  // Import statements need to be relevant to the output file location

  return {
    statement: `import ${sanitizedWidgetName}_${type}_${sanitizedFileName} from '${filePath + (raw ? '?raw' : '')}';`,
    name: `${sanitizedWidgetName}_${type}_${sanitizedFileName}`,
  };
}