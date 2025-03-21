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
2. Create 4 seperate files `custom.css`, `custom.html`, (`custom.js` or `custom.ts`) and `custom.json`. Those 4 files represent the custom code that's used in a Streamelements widget.
3. Each folder within the `src/widgets` directory represent a widget that can be previewed and tested

## Using Typescript
If you want of type safety, create a `custom.ts` file instead of `custom.js` in the widget folder (You can't have a `.js` file and a `.ts` file in the same widget directory)

Custom types for each widget are generated based on data in `custom.json` for each widget directory. Data sent for any Streamelements events are correctly typed based on custom fields.

The expected event data for the following Streamelements events are fully typed.
```Typescript
// custom.ts

window.addEventListener('onWidgetLoad', function (obj) {});

window.addEventListener('onEventReceived', function (obj) {});

window.addEventListener("onSessionUpdate", function (obj) {});
```

The Streamelements API is also fully typed. It's available under the global scope declared as `SE_API`. Exactly the same as expected in widgets once live in Streamelements.

All custom field types should be generated during the build step or after saving any `custom.json` file, which triggers HMR (Hot module reload)
