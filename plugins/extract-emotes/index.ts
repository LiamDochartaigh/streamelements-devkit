import { Plugin } from 'vite';
import { html } from './rawEmotes';
import fs from 'node:fs';

export default function emoteParse(): Plugin {
    return {
        name: 'emote-parse',
        enforce: 'post',
        async buildStart() {
            const value = await transform(html);
            const finalJson = JSON.stringify(value, null, 2);
            //fs.writeFileSync('emotes.json', finalJson);
            //console.log('Final ', finalJson);
        }
    };
}

async function transform(emoteHtml: string) {
    const fileContent = emoteHtml;

    const emotesData: { [key: string]: any } = {};

    const emoteBlocks = fileContent.split('<div class="Layout-sc-1xcs6mc-0 fpPbUf">');

    for (let i = 1; i < emoteBlocks.length; i++) {
        const block = emoteBlocks[i];

        const nameMatch = block.match(/name="([^"]+)"/);
        if (!nameMatch) continue;
        const name = nameMatch[1];

        const srcMatch = block.match(/<img[^>]*src="([^"]+)"/);
        if (!srcMatch) continue;
        const src = srcMatch[1];

        const srcsetMatch = block.match(/srcset="([^"]+)"/);
        if (!srcsetMatch) continue;
        const srcset = srcsetMatch[1];

        emotesData[name] = {
            name: name,
            src: src,
            srcset: srcset
        };
    }
    return emotesData;
}