const ts = require("typescript");
const fs = require("fs");
const path = require("path");

function processFile(content) {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const interfacesToInclude = new Set();
  const interfacesToIncludeDeps = new Set();
  const allInterfaces = new Map();

  // First pass: Find all interfaces and mark @monaco ones
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      allInterfaces.set(name, node);

      const jsDocTags = ts.getJSDocTags(node);
      if (jsDocTags.some((tag) => tag.tagName.text === "monaco")) {
        interfacesToInclude.add(name);
        if (
          jsDocTags.some((tag) => tag.tagName.text === "monaco_include_deps")
        ) {
          interfacesToIncludeDeps.add(name);
        }
      }
    }
  });

  // Second pass: Find dependencies of marked interfaces
  let added;
  do {
    added = false;
    Array.from(interfacesToIncludeDeps).forEach((interfaceName) => {
      const node = allInterfaces.get(interfaceName);
      if (!node) return;

      ts.forEachChild(node, (member) => {
        if (ts.isPropertySignature(member) && member.type) {
          const typeName = member.type.getText(sourceFile);
          if (
            allInterfaces.has(typeName) &&
            !interfacesToInclude.has(typeName)
          ) {
            interfacesToInclude.add(typeName);
            added = true;
          }
        }
      });
    });
  } while (added);

  // Generate output without imports/exports
  const printer = ts.createPrinter();
  let output = [];

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;

    if (
      ts.isInterfaceDeclaration(node) &&
      interfacesToInclude.has(node.name.text)
    ) {
      const interfaceText = printer.printNode(
        ts.EmitHint.Unspecified,
        node,
        sourceFile,
      );
      output.push(interfaceText.replace(/export\s+/g, ""));
    }
  });

  return output.join(" ");
}

/**
 * This script has the purpose to scan the specified files
 * and extract interfaces, that are intended to be exposed to the JavasScript playground,
 * which uses monaco editor, which intern has capability of showing suggestions.
 * The suggestions are passed as string in the form of Typescript types.
 * In order to avoid interface duplication, this script will dynamically generate it from
 * actual code.
 *
 * To include an interface, just add comment like so:
 *  @monaco
 *
 * To include its dependencies, add this comment too:
 *  @monaco_include_deps
 *
 */
const typeFiles = [
  "./src/app/api/accounts/local/local-account.ts",
  "./src/app/api/accounts/v1/account-v1.ts",
  "./src/app/api/env/country-environment.model.ts",
  "./src/app/api/env/country-environment-creds.payload.ts",
  "./src/app/api/template/arg/request-template-arg.ts",
];

let combinedTypes = "";
typeFiles.forEach((file) => {
  const content = fs.readFileSync(path.resolve(__dirname, file), "utf8");
  combinedTypes += processFile(content) + " ";
});

fs.writeFileSync(
  path.resolve(__dirname, "./src/app/ui/template-history/template/template-payload-playground-dialog/generated-editor-lib.ts"),
  `export const GENERATED_EDITOR_LIB = ${JSON.stringify(combinedTypes)};`,
);
