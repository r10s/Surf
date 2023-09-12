"use strict";

const { minify } = require("terser");
const {
  copyFile,
  mkdir,
  readdir,
  writeFile,
  readFile,
  stat,
} = require("fs/promises");
const fs = require("fs");
const archiver = require("archiver");
const del = require("del");
const path = require("path");

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  let entries = await readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    if (entry.name.endsWith("~")) continue
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await copyFile(srcPath, destPath);
  }
}

const appName = "Surf";
const jsFiles = [ 
    "resources/js/base-error-reporting.js",
    "resources/js/surf-error-reporting.js",
    "resources/js/assert.js",
    "resources/js/promise_resolver.js",
    "resources/js/cr.js",
    "resources/js/parse_html_subset.js",
    "resources/js/load_time_data.js",
    "resources/js/util.js",
    "resources/js/strings.js",
    "resources/js/surf.bundle.js",
];

(async () => {
  try {
    await del("dist/");
    await del(appName + ".xdc");
    await mkdir("dist/resources/js/", { recursive: true });
    await mkdir("dist/node_modules/webxdc-scores/dist/", { recursive: true });


    await copyDir("resources/surf/", "dist/resources/surf/");
    await copyDir("resources/ski/", "dist/resources/ski/");
    await copyDir("resources/css/", "dist/resources/css/");
    await copyFile("resources/js/lib_react.chunk.js", "dist/resources/js/lib_react.chunk.js");
    await copyFile("resources/js/lib_common.chunk.js", "dist/resources/js/lib_common.chunk.js");
    await copyFile("node_modules/webxdc-scores/dist/webxdc-scores.umd.js", "dist/node_modules/webxdc-scores/dist/webxdc-scores.umd.js");

    await copyFile("manifest.toml", "dist/manifest.toml");
    await copyFile("icon.png", "dist/icon.png");
    await copyFile("index.html", "dist/index.html");


    jsFiles
          .map(async (file) => {
              const buffer = await readFile(file);
              const minified = await minify(buffer.toString());
              await writeFile("dist/" + file, minified.code);
          });

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(appName + ".xdc");
      output.on("error", reject);
      output.on("close", resolve);

      const archive = archiver("zip", {
        zlib: { level: 9 },
      });
      archive.directory("dist/", false);
      archive.pipe(output);
      archive.finalize();
    });

    const stats = await stat(appName + ".xdc");
    const maxSize = 640 * 1024;

    console.log(
      `${stats.size} / ${maxSize} (${Math.round(
        (stats.size * 100) / maxSize
      )}%)`
    );
  } catch (err) {
    console.error(err);
  }
})();
