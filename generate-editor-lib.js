const ts = require("typescript");
const fs = require("fs");
const path = require("path");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
 * This script has the purpose to scan the specified files (or paths)
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

const typeFiles = ['./src/app/*'];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getTSFilesRecursive(dirPath) {
  let results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getTSFilesRecursive(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  }

  return results;
}

function revertToRelative(paths) {
  return paths.map((f) => '.' + f.replace(__dirname, '').replaceAll('\\', '/'));
}

/**
 * Convert file patterns to concrete file paths
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function expandFilePatterns(patterns) {
  const expandedFiles = [];

  for (const pattern of patterns) {
    const fullPattern = path.resolve(__dirname, pattern);

    if (pattern.includes('*') && fs.existsSync(path.dirname(fullPattern))) {
      const baseDir = path.dirname(fullPattern);
      const filesInDir = revertToRelative(getTSFilesRecursive(baseDir));

      expandedFiles.push(...filesInDir);
    } else if (pattern.endsWith(path.sep) && fs.existsSync(fullPattern)) {
      expandedFiles.push(...revertToRelative(getTSFilesRecursive(fullPattern)));
    } else if (fs.existsSync(fullPattern)) {
      expandedFiles.push(pattern);
    } else {
      console.warn(`File not found: ${pattern}`);
    }
  }

  return [...new Set(expandedFiles)];
}

const allFiles = expandFilePatterns(typeFiles);

let combinedTypes = "";
let processedFilesCount = 0;
allFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");

  const processedFileTypes = processFile(content) + " ";
  if (processedFileTypes.trim().length < 1) {
    console.log(`File ${file} is empty`);
    return;
  } else {
    console.log(`Processed file ${file}`);
    processedFilesCount++;
  }

  combinedTypes += processedFileTypes;
});

console.log(`Processed ${processedFilesCount} files`);

fs.writeFileSync(
  path.resolve(
    __dirname,
    "./src/app/ui/template-history/template/template-payload-playground-dialog/generated-editor-lib.ts",
  ),
  `export const GENERATED_EDITOR_LIB = ${JSON.stringify(combinedTypes)};`,
);
