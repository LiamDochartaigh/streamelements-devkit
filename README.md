# Streamelements Devkit

Development kit to build streamelements widgets locally, benefiting from HMR and IDE support.

## Getting Started

Use the following command to install the project dependencies. 

```bash
npm install
```
Or
```bash
pnpm install
```
Once finished, run with this
```bash
npm run dev
```
Or
```bash
pnpm dev
```


## Development

1. Create a new folder under src/widgets with your widgets name
1. Create 4 seperate files (name them "custom") with .css, .html, .js, .json file extensions
3. Plug the new folder name and files into the existing imports for `src/views/CustomWidgetEditor.vue` and `src/views/CustomWidgetPreview.vue`
4. Also change `currentWidget` to the relevant type `chat` | `eventlist` | `goal`

```Typescript
//CHANGE ACTIVE WIDGET AND WIDGET TYPE HERE
let currentWidget: WidgetTypes = WidgetTypes.chat;
import customHTML from "../widgets/Free Chat Widget/custom.html?raw"
import customCSS from "../widgets/Free Chat Widget/custom.css?raw"
import customFields from "../widgets/Free Chat Widget/custom.json"
import customJS from "../widgets/Free Chat Widget/custom.js?raw"
```