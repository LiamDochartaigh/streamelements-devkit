import { Plugin, transformWithEsbuild } from 'vite';
import * as ts from 'typescript';
import fs from 'node:fs/promises';
import path from 'node:path';

export default function customTransformer(options: any = {
    modulesDir: 'src/widgets'
}): Plugin {
    const { modulesDir } = options;
    return {
        name: 'custom-transformer',
        enforce: 'post',
        buildStart() {
            transform(modulesDir);
        },
        handleHotUpdate({ file }) {
            if (path.dirname(file).includes(modulesDir)
                && !file.includes('custom-fields.d.ts')
                && path.extname(file) === '.ts')
                transform(modulesDir);
        }
    };
}

async function transform(modulesDir: string) {
    const folderPath = path.resolve(modulesDir);
    const moduleFolders = await fs.readdir(folderPath, { withFileTypes: true });

    const fileExtensions = ['.ts'];

    // Turn folders into modules
    for (const folder of moduleFolders) {
        if (!folder.isDirectory()) continue;

        const moduleName = folder.name;
        const modulePath = path.join(folderPath, moduleName);
        const moduleFiles = await fs.readdir(modulePath);

        const fileFilter = ['tsconfig.json', 'custom-fields.d.ts'];
        for (const file of moduleFiles) {
            const extension = path.extname(file);

            if (fileExtensions.includes(extension) && !fileFilter.includes(file)) {
                const tsFile = await fs.readFile(path.join(modulePath, file), 'utf-8');
                //const customFields = await fs.readFile(path.join(modulePath, 'custom-fields.d.ts'), 'utf-8');
                //const sourceFile = ts.createSourceFile('custom-fields-source', customFields, ts.ScriptTarget.Latest, true);
                //const fieldNames = parseCustomFieldsFromSource(sourceFile);

                const transformed = await transformWithEsbuild(tsFile, file, {
                    target: 'esNext',
                    format: 'esm',
                    loader: 'ts',
                });
                await fs.writeFile(path.join(modulePath, file.replace('.ts', '.js')), transformed.code);
            }
        }
    }
}

function parseCustomFieldsFromSource(sourceFile: ts.SourceFile) {
    const findFields = (node: ts.Node, syntaxMatch: ts.SyntaxKind) => {
        let matchingNodes: ts.Node[] = [];
        node.forEachChild(childNode => {
            if (childNode.kind === syntaxMatch) {
                matchingNodes.push(childNode);
            }
            else if (childNode.getChildCount() > 0) {
                matchingNodes = matchingNodes.concat(findFields(childNode, syntaxMatch));
            }
        });
        return matchingNodes;
    }
    const matchingFields = findFields(sourceFile, ts.SyntaxKind.VariableDeclaration)
        .map(field => {
            return field.getChildren().find(child => child.kind === ts.SyntaxKind.Identifier)?.getText();
        });
    return matchingFields;
}