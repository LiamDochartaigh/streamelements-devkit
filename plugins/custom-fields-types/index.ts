import fs from 'node:fs/promises';
import path from 'node:path';

export default function widgetRegistry(options: any = {
  modulesDir: 'src/widgets',
  outputFile: 'src/custom-fields.ts',
}) {
  const { modulesDir, outputFile } = options;
  return {
    name: 'custom-fields',

    async buildStart() {
      try {
        const modulesFolderPath = path.resolve(modulesDir);
        const moduleFolders = await fs.readdir(modulesFolderPath, { withFileTypes: true });

        const modules: string[] = [];
        const imports: string[] = [];

        const folderFilter = ['.git'];

        // Turn folders into modules
        for (const folder of moduleFolders) {
          if (!folder.isDirectory() || folderFilter.includes(folder.name)) continue;

          const moduleName = folder.name;
          const modulePath = path.join(modulesFolderPath, moduleName);
          const moduleFiles = await fs.readdir(modulePath);

          //const assets: Assets = {};
          let config;
          const fileFilter = ['tsconfig.json'];
          for (const file of moduleFiles) {
            const extension = path.extname(file);
            if (extension === '.json' && !fileFilter.includes(file)) {
              console.log('Found file:', file);
              //console.log('Found JSON file:', modulePath, file, extension);
              const fileContent = await fs.readFile(path.join(modulePath, file));
              //console.log(fileContent.toString());
              // Found the JSON so then need to read the file and split into the 
              // typed variables
            }
          }

          // modules.push(JSON.stringify({
          //   name: moduleName,
          //   assets,
          //   config,
          // }, null, 2));
        }
        // Generate the TypeScript file content
        const content = '';

        // Ensure output directory exists
        const outputDir = path.dirname(outputFile);
        await fs.mkdir(outputDir, { recursive: true });

        // Write the file
        await fs.writeFile(outputFile, content, 'utf-8');

        console.log(`Custom Field types generated at ${outputFile} with ${modules.length} modules`);
      } catch (error) {
        console.error('Error generating custom field types:', error);
      }
    }
  };
}

function parseCustomFields(customFields: string) {
  return customFields.split('\n').map((line) => {
    const [name, type] = line.split(':');
    return { name, type };
  });

}