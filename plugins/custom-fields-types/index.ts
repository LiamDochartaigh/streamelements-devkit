import fs from 'node:fs/promises';
import path from 'node:path';

export default function widgetRegistry(options: any = {
  modulesDir: 'src/widgets'
}) {
  const { modulesDir } = options;
  return {
    name: 'custom-fields',

    async buildStart() {
      try {
        const modulesFolderPath = path.resolve(modulesDir);
        const moduleFolders = await fs.readdir(modulesFolderPath, { withFileTypes: true });

        const modules: string[] = [];
        const folderFilter = ['.git'];

        // Turn folders into modules
        for (const folder of moduleFolders) {
          if (!folder.isDirectory() || folderFilter.includes(folder.name)) continue;

          const moduleName = folder.name;
          const modulePath = path.join(modulesFolderPath, moduleName);
          const moduleFiles = await fs.readdir(modulePath);

          const fileFilter = ['tsconfig.json'];
          let types: string[] = [];
          for (const file of moduleFiles) {
            const extension = path.extname(file);
            if (extension === '.json' && !fileFilter.includes(file)) {
              const fileContent = await fs.readFile(path.join(modulePath, file));
              types = parseFieldTypes(fileContent.toString());
            }
          }
          let content = 'export {};\n\n';
          content = content.concat(
            `declare global {\n  ${types.join('\n  ')}\n}`
          );
          const outputFile = path.join(modulePath, 'custom-fields.d.ts');
          const outputDir = path.dirname(outputFile);
          await fs.mkdir(outputDir, { recursive: true });

          await fs.writeFile(outputFile, content, 'utf-8');

          const tsconfigContent = {
            "include": [
              "./**/*.ts", "../types.d.ts"
            ],
            "compilerOptions": {
              "composite": true,
              "allowJs": true,
              "esModuleInterop": true,
              "resolveJsonModule": true,
              "strict": true,
            }
          }
          const tsconfigFile = path.join(modulePath, 'tsconfig.json');
          await fs.writeFile(tsconfigFile, JSON.stringify(tsconfigContent, null, 2), 'utf-8');
        }
        console.log(`Custom Field types generated with ${modules.length} modules`);
      } catch (error) {
        console.error('Error generating custom field types:', error);
      }
    }
  };
}


function parseFieldTypes(customFields: string) {
  const parsed = JSON.parse(customFields);

  const parsedTypes: string[] = [];
  Object.keys(parsed).forEach((key) => {
    if (parsed[key].type === 'dropdown') {
      let types = '';
      Object.keys(parsed[key].options).forEach((option: string) => {
        types = !types ? `'${option}'` : types + ` | '${option}'`;
      })
      parsedTypes.push(`const ${key}: ${types};`);
    }
    else if (parsed[key].type === 'textfield'
      || parsed[key].type === 'text'
      || parsed[key].type === 'colorpicker'
      || parsed[key].type === 'googleFont') {
      parsedTypes.push(`const ${key}: string;`);
    }
    else if (parsed[key].type === 'checkbox') {
      parsedTypes.push(`const ${key}: boolean;`);
    }
    else if (parsed[key].type === 'slider' || parsed[key].type === 'number') {
      parsedTypes.push(`const ${key}: number;`);
    }
  });
  return parsedTypes;
}