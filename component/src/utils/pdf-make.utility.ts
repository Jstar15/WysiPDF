// ./color-palette-generator.utility.ts
import type { TDocumentDefinitions } from "pdfmake/interfaces";

export class PdfMakeUtility {
  public static printSimpleWithFunctionSource(docDefinition: TDocumentDefinitions): string {
    try {
      const functionReplacer = (key: string, value: any) => {
        if (typeof value === "function") {
          // Collapse whitespace inside the function source to one space
          const source = value.toString().replace(/\s+/g, " ");

          return {
            __isFunction: true,
            source,
            sampleOutput:
              key === "header" || key === "footer"
                ? (() => {
                  try {
                    return value(1, 10);
                  } catch (e: any) {
                    return `Error executing function: ${e.message}`;
                  }
                })()
                : key === "background"
                  ? (() => {
                    try {
                      return value();
                    } catch (e: any) {
                      return `Error executing function: ${e.message}`;
                    }
                  })()
                  : "Function not executed",
          };
        }
        return value;
      };

      // Normal stringify with indentation
      const serializedDoc = JSON.stringify(docDefinition);
      return serializedDoc;
    } catch (error: any) {
      console.error("Error stringifying document definition with functions:", error);
      return JSON.stringify({ error: error.message }, null, 2);
    }
  }
}
