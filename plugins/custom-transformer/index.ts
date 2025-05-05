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
        async buildStart() {
            const widgetEntries = await fs.readdir(modulesDir, { withFileTypes: true });
            widgetEntries
            .filter(entry => entry.isDirectory() && entry.name !== '.git')
            .map(async entry => {
                const files = await fs.readdir(path.join(modulesDir, entry.name));
                files.filter(file => file.endsWith('.ts') && !file.includes('.d.ts'))
                .map(async file => {
                    const filePath = path.posix.join(modulesDir, entry.name, file);
                    await transform(modulesDir, filePath);
                })

            });
        },
        async handleHotUpdate({ file, server, modules }) {
            transform(modulesDir, file);
        }
    }
}

async function transform(modulesDir: string, file: string) {
    if (path.dirname(file).includes(modulesDir)
        && !file.includes('custom-fields.d.ts')
        && path.extname(file) === '.ts') {
        console.log('Transforming File', file);
        const tsFile = await fs.readFile(file, 'utf-8');
        const transformed = await transformWithEsbuild(tsFile, file, {
            target: 'esNext',
            format: 'iife',
            loader: 'ts',
        });
        await fs.writeFile(file.replace('.ts', '.js'), transformed.code);
    }
}