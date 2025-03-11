# Streamelements Devkit

Development kit to build streamelements widgets locally, benefiting from HMR and IDE support.

## Getting Started

Use the following command to install the project dependencies. 

```bash
# npm
npm install

# pnpm
pnpm install
```

Once finished, run with this
```bash
# npm
npm run dev

# pnpm
pnpm dev
```

## Development

1. Create a new folder under src/widgets with your widgets name
1. Create 4 seperate files (name them "custom") with .css, .html, .js, .json file extensions
4. Change `currentWidget` to the relevant type `chat` | `eventlist` | `goal` in files `src/views/CustomWidgetEditor.vue` and `src/views/CustomWidgetPreview.vue`
```Typescript
//CHANGE WIDGET TYPE HERE
let currentWidget: WidgetTypes = WidgetTypes.chat;
```