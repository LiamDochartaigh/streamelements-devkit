export interface WidgetRegistryOptions {
    modulesDir: string;
    outputFile: string;
    fileExtensions: Record<string, string[]>;
}

export interface Assets {
    js?: string;
    css?: string;
    template?: string;
    fields?: string;
    [key: string]: string | undefined;
}

export interface Widget {
    name: string;
    assets: Assets;
}