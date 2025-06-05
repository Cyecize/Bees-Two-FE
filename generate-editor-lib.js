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

  const typesToInclude = new Set(); // Handles interfaces AND enums
  const interfacesToIncludeDeps = new Set();
  const allInterfaces = new Map();
  const allEnums = new Map(); // Stores enum declarations

  // First pass: Find all interfaces/enums and mark @monaco ones
  ts.forEachChild(sourceFile, (node) => {
    // Handle interfaces
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      allInterfaces.set(name, node);

      const jsDocTags = ts.getJSDocTags(node);
      if (jsDocTags.some((tag) => tag.tagName.text === "monaco")) {
        typesToInclude.add(name);
        if (
          jsDocTags.some((tag) => tag.tagName.text === "monaco_include_deps")
        ) {
          interfacesToIncludeDeps.add(name);
        }
      }
    }
    // Handle enums
    else if (ts.isEnumDeclaration(node)) {
      const name = node.name.text;
      allEnums.set(name, node);

      const jsDocTags = ts.getJSDocTags(node);
      if (jsDocTags.some((tag) => tag.tagName.text === "monaco")) {
        typesToInclude.add(name);
      }
    }
  });

  // Second pass: Find dependencies of marked interfaces using a queue for Breadth-First Search
  const queue = Array.from(interfacesToIncludeDeps);
  const processed = new Set();

  while (queue.length > 0) {
    const interfaceName = queue.shift();

    if (processed.has(interfaceName)) {
      continue;
    }
    processed.add(interfaceName);

    const node = allInterfaces.get(interfaceName);
    if (!node) continue;

    ts.forEachChild(node, (member) => {
      if (ts.isPropertySignature(member) && member.type) {
        // By splitting by [, array type suffix is removed and it can then be
        // found in the interfaces collection
        const typeName = member.type.getText(sourceFile).split("[")[0];

        // Include interface dependencies
        if (allInterfaces.has(typeName) && !typesToInclude.has(typeName)) {
          typesToInclude.add(typeName);
          queue.push(typeName);
        }
        // Include enum dependencies
        else if (allEnums.has(typeName) && !typesToInclude.has(typeName)) {
          typesToInclude.add(typeName);
        }
      }
    });
  }

  // Generate output without imports/exports
  const printer = ts.createPrinter();
  const output = [];

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;

    // Print included interfaces
    if (ts.isInterfaceDeclaration(node) && typesToInclude.has(node.name.text)) {
      const interfaceText = printer.printNode(
        ts.EmitHint.Unspecified,
        node,
        sourceFile,
      );
      output.push(interfaceText.replace(/export\s+/g, ""));
    }
    // Print included enums
    else if (ts.isEnumDeclaration(node) && typesToInclude.has(node.name.text)) {
      const enumText = printer.printNode(
        ts.EmitHint.Unspecified,
        node,
        sourceFile,
      );
      output.push(enumText.replace(/export\s+/g, ""));
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
 * To run the script, execute the following command from the project root:
 * node .\generate-editor-lib.js
 *
 */
const typeFiles = [
  "./src/app/api/accounts/local/local-account.ts",
  "./src/app/api/accounts/v1/account-v1.ts",
  "./src/app/api/env/country-environment.model.ts",
  "./src/app/api/env/country-environment-language.model.ts",
  "./src/app/api/env/country-environment-creds.payload.ts",
  "./src/app/api/template/arg/request-template-arg.ts",
  "./src/app/api/grow/dto/grow-organization.ts",
  "./src/app/api/grow/dto/grow-organization.payload.ts",
  "./src/app/api/grow/dto/grow-group.payload.ts",
  "./src/app/shared/dialog/dialogs/generic-picker-dialog/generic-picker.option.ts",
  "./src/app/shared/dialog/dialogs/generic-picker-dialog/generic-picker-response.impl.ts",
  "./src/app/api/env/token/bees-token.ts",
  "./src/app/api/grow/grow.service.ts",
  "./src/app/api/proxy/bees-response.ts",
  "./src/app/api/grow/dto/grow-group.ts",
  "./src/app/api/accounts/contracts/bees-contract.ts",
  "./src/app/api/accounts/contracts/bees-contract.service.ts",
  "./src/app/shared/util/page.ts",
  "./src/app/api/orders/order.service.ts",
  "./src/app/api/orders/dto/order.query.ts",
  "./src/app/api/common/bees-param.ts",
  "./src/app/shared/util/page-request.ts",
  "./src/app/api/orders/dto/order.ts",
  "./src/app/api/grow/dto/grow-user.payload.ts",
  "./src/app/api/vendor/vendor-v2.ts",
  "./src/app/api/vendor/vendor-v2.service.ts",
  "./src/app/api/env/country-environment.service.ts",
  "./src/app/shared/util/field-error-wrapper-local.ts",
  "./src/app/shared/field-error/field-error.ts",
  "./src/app/api/items/item.ts",
  "./src/app/api/items/item.service.ts",
  "./src/app/api/items/items-search.response.ts",
  "./src/app/api/items/items-search.query.ts",
  "./src/app/api/env/sharedclient/shared-client.payload.ts",
  "./src/app/api/env/sharedclient/shared-client.query.ts",
  "./src/app/api/env/sharedclient/shared-client.repository.ts",
  "./src/app/api/env/sharedclient/shared-client.service.ts",
  "./src/app/api/env/sharedclient/shared-client.ts",
  "./src/app/api/env/env.ts",
  "./src/app/api/common/bees-entity.ts",
  "./src/app/api/env/sharedclient/shared-client-token.ts",
];

let combinedTypes = "";
typeFiles.forEach((file) => {
  const content = fs.readFileSync(path.resolve(__dirname, file), "utf8");
  combinedTypes += processFile(content) + " ";
});

fs.writeFileSync(
  path.resolve(
    __dirname,
    "./src/app/ui/template-history/template/template-payload-playground-dialog/generated-editor-lib.ts",
  ),
  `export const GENERATED_EDITOR_LIB = ${JSON.stringify(combinedTypes)};`,
);
