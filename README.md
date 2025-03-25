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
1. Create a new folder under src/widgets with your widgets name.
2. Create 4 seperate files `custom.css`, `custom.html`, (`custom.js` or `custom.ts`) and `custom.json`. Those 4 files represent the custom code that's used in a Streamelements widget.
3. Each folder within the `src/widgets` directory represent a widget that can be previewed and tested.

## Using Typescript
If you want type safety, create a `custom.ts` file instead of `custom.js` in the widget folder. Whenever you run `pnpm dev` or save changes to those `custom.ts` files, a transpiled javascript file is generated in the widget folder (which can later be used in Streamelements).

Custom types for each widget are generated based on `custom.json` in each widget directory.

All Streamelements events are fully typed.
```Typescript
// custom.ts

window.addEventListener('onWidgetLoad', function (obj) {});

window.addEventListener('onEventReceived', function (obj) {});

window.addEventListener("onSessionUpdate", function (obj) {});
```

The Streamelements API is also fully typed. It's available globally as `SE_API`. Exactly the same as expected in widgets once live in Streamelements.

Custom field types are generated during the build step or when saving `custom.json` files, via HMR (Hot Module Reload).

## Differences To Streamelements
One feature available in Streamelements that's not compatible in this devkit for Typescript files are variables injected via handlebars'.

```Typescript
// This won't work
const msgLength = {{ messageLength }}
```

Instead I recommend assigning data from fields directly using the `onWidgetLoad` event payload.

The `CustomFields` interface is globally available for each widget.

```Typescript
let fieldData: CustomFields;

window.addEventListener('onWidgetLoad', function (obj) {
  fieldData = obj.detail.fieldData;
});

```