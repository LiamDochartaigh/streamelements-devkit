// Auto-generated module registry
// Generated on 2025-03-10T21:49:39.690Z

interface ModuleAsset {
  js?: string;
  css?: string;
  template?: string;
  [key: string]: string | undefined;
}

interface ModuleInfo {
  name: string;
  assets: ModuleAsset;
}

export const modules: ModuleInfo[] = [
  {
    name: "Free Chat Widget",
    assets: {
      css: "./src/widgets/Free Chat Widget/custom.css",
      template: "./src/widgets/Free Chat Widget/custom.html",
      js: "./src/widgets/Free Chat Widget/custom.js",
      fields: "./src/widgets/Free Chat Widget/custom.json"
    }
  },
  {
    name: "Test Chatbox",
    assets: {
      css: "./src/widgets/Test Chatbox/custom.css",
      template: "./src/widgets/Test Chatbox/custom.html",
      js: "./src/widgets/Test Chatbox/custom.js",
      fields: "./src/widgets/Test Chatbox/custom.json"
    }
  },
  {
    name: "Test Goals",
    assets: {
      css: "./src/widgets/Test Goals/custom.css",
      template: "./src/widgets/Test Goals/custom.html",
      js: "./src/widgets/Test Goals/custom.js",
      fields: "./src/widgets/Test Goals/custom.json"
    }
  }
];