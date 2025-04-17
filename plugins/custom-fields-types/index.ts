import fs from 'node:fs/promises';
import path from 'node:path';
import { Plugin } from 'vite';

export default function genCustomFieldTypes(options: any = {
  modulesDir: 'src/widgets'
}): Plugin {
  const { modulesDir } = options;
  const folderFilter = ['.git'];
  const fileFilter = ['tsconfig.json'];
  const genTypes = async () => {
    try {
      const modulesFolderPath = path.resolve(modulesDir);
      const moduleFolders = await fs.readdir(modulesFolderPath, { withFileTypes: true });

      let widgets = 0;

      // Turn folders into modules
      for (const folder of moduleFolders) {
        if (!folder.isDirectory() || folderFilter.includes(folder.name)) continue;

        widgets++;
        const moduleName = folder.name;
        const modulePath = path.join(modulesFolderPath, moduleName);
        const moduleFiles = await fs.readdir(modulePath);
        
        let globalTypes: string[] = [];
        let propTypes: string[] = [];
        let buttonTypes: string[] = [];
        for (const file of moduleFiles) {
          const extension = path.extname(file);
          if (extension === '.json' && !fileFilter.includes(file)) {
            const fileContent = await fs.readFile(path.join(modulePath, file));
            const { parsedProps, parsedTypes, parsedButtons } = parseFieldTypes(fileContent.toString());
            globalTypes = parsedTypes;
            propTypes = parsedProps;
            buttonTypes = parsedButtons;
          }
        }
        await writeDeclarationFile(globalTypes, propTypes, modulePath, buttonTypes);
        await writeConfigFile(modulePath);
      }
      console.log(`Custom Field types generated for ${widgets} widgets`);
    } catch (error) {
      console.error(`Error generating custom field types `, error);
    }
  }
  return {
    name: 'custom-fields',
    async buildStart() {
      await genTypes();
    },
    handleHotUpdate({ file, server }) {
      if (!fileFilter.includes(path.basename(file))
        && path.dirname(file).includes(modulesDir)
        && path.extname(file) === '.json') {
        genTypes();
      }
      return undefined;
    },
  };
}

async function writeDeclarationFile(globalTypes: string[], propTypes: string[], modulePath: string, buttonTypes: string[] = []) {
  let content = 'export {};\n\n';
  content = content.concat(
    `declare global {\n  interface CustomFields {\n    ${propTypes.join('\n    ')}\n  }`
  );
  content = content.concat(`\n  type ButtonTypes = '${buttonTypes.join('\' | \'')}'; \n}`);
  const outputFile = path.join(modulePath, 'custom-fields.d.ts');
  const outputDir = path.dirname(outputFile);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, content, 'utf-8');
}

async function writeConfigFile(modulePath: string) {
  const tsconfigContent = {
    "include": [
      "./**/*.ts", "../../se-types.d.ts"
    ],
    "compilerOptions": {
      "composite": true,
      "allowJs": true,
      "target": "ES2024",
      "esModuleInterop": true,
      "moduleResolution": "node16",
      "module": "Node16",
      "resolveJsonModule": true,
      "strict": true
    }
  }
  const tsconfigFile = path.join(modulePath, 'tsconfig.json');
  await fs.writeFile(tsconfigFile, JSON.stringify(tsconfigContent, null, 2), 'utf-8');
}

function parseFieldTypes(customFields: string) {
  const parsed = JSON.parse(customFields);

  const parsedTypes: string[] = [];
  const parsedProps: string[] = [];
  const parsedButtons: string[] = [];
  Object.keys(parsed).forEach((key) => {
    if (parsed[key].type === 'dropdown') {
      let types = '';
      Object.keys(parsed[key].options).forEach((option: string) => {
        types = !types ? `'${option}'` : types + ` | '${option}'`;
      })
      parsedTypes.push(`const ${key}: ${types};`);
      parsedProps.push(`${key}: ${types};`);
    }
    else if (parsed[key].type === 'textfield'
      || parsed[key].type === 'text'
      || parsed[key].type === 'colorpicker'
      || parsed[key].type === 'googleFont') {
      parsedTypes.push(`const ${key}: string;`);
      parsedProps.push(`${key}: string;`);
    }
    else if (parsed[key].type === 'checkbox') {
      parsedTypes.push(`const ${key}: boolean;`);
      parsedProps.push(`${key}: boolean;`);
    }
    else if (parsed[key].type === 'slider' || parsed[key].type === 'number') {
      parsedTypes.push(`const ${key}: number;`);
      parsedProps.push(`${key}: number;`);
    }
    else if (parsed[key].type === 'button') {
      parsedButtons.push(parsed[key].value);
    }
  });
  return {
    parsedProps,
    parsedTypes,
    parsedButtons
  };
}