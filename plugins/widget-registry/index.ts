import fs from 'node:fs/promises';
import path from 'node:path';
import type { Assets, Widget, WidgetRegistryOptions } from './types';

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

        const modules: Widget[] = [];

        for (const folder of moduleFolders) {
          if (!folder.isDirectory()) continue;

          const moduleName = folder.name;
          const modulePath = path.join(modulesFolderPath, moduleName);
          const moduleFiles = await fs.readdir(modulePath);

          const assets: Assets = {};

          for (const file of moduleFiles) {
            const extension = path.extname(file);

            for (const [assetType, validExtensions] of Object.entries(fileExtensions)) {
              if (validExtensions.includes(extension)) {
                const relativePath = path.join(modulesDir, moduleName, file)
                  .replace(/\\/g, '/');

                assets[assetType] = `./${relativePath}`;
                break;
              }
            }
          }

          modules.push({
            name: moduleName,
            assets
          });
        }

        // Generate the TypeScript file content
        const content = `// Auto-generated module registry
// Generated on ${new Date().toISOString()}
// DO NOT EDIT MANUALLY

export interface ModuleAsset {
  js?: string;
  css?: string;
  template?: string;
  [key: string]: string | undefined;
}

export interface ModuleInfo {
  name: string;
  assets: ModuleAsset;
}

export const modules: ModuleInfo[] = ${JSON.stringify(modules, null, 2)};

export default modules;
`;

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