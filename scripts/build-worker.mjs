import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const [html, css, javascript] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"),
  readFile(resolve(root, "style.css"), "utf8"),
  readFile(resolve(root, "script.js"), "utf8")
]);

const assetNames = await readdir(resolve(root, "assets"));
const assetEntries = await Promise.all(
  assetNames
    .filter((name) => /\.(jpg|jpeg|png|webp|gif|svg|mp3|ogg)$/i.test(name))
    .map(async (name) => [name, (await readFile(resolve(root, "assets", name))).toString("base64")])
);
const assets = Object.fromEntries(assetEntries);

const source = `const pages = ${JSON.stringify({ html, css, javascript })};
const files = ${JSON.stringify(assets)};
const mimeTypes = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml", mp3: "audio/mpeg", ogg: "audio/ogg" };

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(pages.html, { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    if (url.pathname === "/style.css") {
      return new Response(pages.css, { headers: { "content-type": "text/css; charset=utf-8" } });
    }
    if (url.pathname === "/script.js") {
      return new Response(pages.javascript, { headers: { "content-type": "text/javascript; charset=utf-8" } });
    }
    if (url.pathname.startsWith("/assets/")) {
      const name = decodeURIComponent(url.pathname.slice(8));
      const encoded = files[name];
      if (encoded) {
        const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
        const extension = name.split(".").pop().toLowerCase();
        return new Response(bytes, { headers: { "content-type": mimeTypes[extension] || "application/octet-stream" } });
      }
    }
    return new Response("Halaman tidak ditemukan", { status: 404 });
  }
};
`;

await writeFile(resolve(root, "dist/server/index.js"), source);
