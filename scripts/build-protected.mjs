/**
 * Protected production output for the mobile wedding invitation.
 * Source-only JS, CSS, editable SVG artwork, test files and staging folders
 * MUST NOT be published. Keeps classic-script execution order intact.
 *
 * Run: npm run build:protected
 */
import { readFile, readdir, mkdir, copyFile, writeFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';
import sharp from 'sharp';

const root = process.cwd();
const out = path.join(root, 'dist');
const htmlPath = path.join(root, 'index.html');
const assetConversions = new Map();

function hash(body) {
  return createHash('sha256').update(body).digest('hex').slice(0, 12);
}
function localFile(url) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return null;
  const clean = url.split(/[?#]/)[0].replace(/^\.\//, '');
  const normalized = path.posix.normalize(clean);
  if (normalized.startsWith('../') || path.isAbsolute(normalized)) {
    throw new Error('Unsafe local URL: ' + url);
  }
  return normalized;
}
function getAttr(tag, key) {
  const match = new RegExp('(?:^|\\s)' + key + '\\s*=\\s*(["\x27])(.*?)\\1', 'i').exec(tag);
  return match ? match[2] : null;
}
function rewriteSourceArtwork(contents) {
  // Referenced editable local SVGs and raster source files are converted to
  // flattened, alpha-preserving WebPs. External URLs are not rewritten.
  return contents.replace(/(^|[('"\s=])((?:\.\/)?assets\/[A-Za-z0-9._/-]+\.(?:svg|png|jpe?g))(?=$|[?#'")\s])/gmi,
    (whole, prefix, url) => {
      const original = localFile(url);
      // Development/reference artwork must never enter the public bundle.
      // The legacy reference-only skin keeps its existing missing-asset fallback.
      if (original.split('/').some(isDevDirectory)) return whole;
      const publicName = original + '.webp';
      assetConversions.set(original, publicName);
      return prefix + url + '.webp';
    });
}
function isDevDirectory(name) {
  return /^(?:assests|reference-dev|reference|staging|master|masters|original|backup|backups|evidence|screenshots|test-results|playwright-report|\.private)$/i.test(name)
    || /(?:^|-)staging(?:-|$)/i.test(name)
    || /(?:^|-)evidence(?:-|$)/i.test(name);
}
async function copyPublishedMedia(folder, relative = '') {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const rel = path.posix.join(relative, entry.name);
    const absolute = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!isDevDirectory(entry.name)) await copyPublishedMedia(absolute, rel);
      continue;
    }
    if (!entry.isFile()) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (!['.webp', '.avif', '.mp3', '.m4a', '.ogg', '.webm', '.woff2'].includes(extension)) continue;
    await mkdir(path.dirname(path.join(out, rel)), { recursive: true });
    await copyFile(absolute, path.join(out, rel));
  }
}
/**
 * librsvg (used by sharp for SVG input) silently skips data:image/webp image
 * elements. This makes approved floral/paper compositions transparent even
 * though the conversion exits successfully.
 *
 * Convert only the *embedded transport images* to lossless PNG inside an
 * in-memory SVG before rasterizing the outer composition. The original SVG
 * and original WebPs remain byte-for-byte untouched in private GitHub.
 */
async function artworkRasterInput(source) {
  if (!/\.svg$/i.test(source)) {
    return { input: source, embeddedWebpsDecoded: 0 };
  }
  const svg = await readFile(source, 'utf8');
  const originals = [...new Set(
    [...svg.matchAll(/data:image\/webp;base64,[a-z0-9+/=]+/gi)].map(x => x[0])
  )];
  if (!originals.length) return { input: source, embeddedWebpsDecoded: 0 };

  let normalized = svg;
  for (const original of originals) {
    const webpBytes = Buffer.from(original.slice('data:image/webp;base64,'.length), 'base64');
    const pngBytes = await sharp(webpBytes, { limitInputPixels: 100000000 })
      .png({ compressionLevel: 6 }).toBuffer();
    normalized = normalized.replaceAll(
      original, 'data:image/png;base64,' + pngBytes.toString('base64')
    );
  }
  return { input: Buffer.from(normalized), embeddedWebpsDecoded: originals.length };
}

async function assertVisibleArtwork(outputFile, source) {
  const image = sharp(outputFile);
  const meta = await image.metadata();
  if (meta.width < 1 || meta.height < 1) throw new Error('Zero-sized artwork: ' + source);
  if (!meta.hasAlpha) return;
  const preview = sharp(outputFile).resize({
    width: Math.min(meta.width, 128),
    height: Math.min(meta.height, 128),
    fit: 'fill'
  });
  const info = await preview.stats();
  if (info.channels[3]?.max === 0) {
    throw new Error('Converted artwork is fully transparent: ' + source);
  }
}

async function build() {
  const htmlOriginal = await readFile(htmlPath, 'utf8');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const cssTagPattern = /<link\b[^>]*\brel=(["'])stylesheet\1[^>]*>/gi;
  const scriptTagPattern = /<script\b[^>]*\bsrc=(["'])[^"']+\1[^>]*><\/script>/gi;
  const styles = [...htmlOriginal.matchAll(cssTagPattern)]
    .map(match => ({ tag: match[0], url: getAttr(match[0], 'href') }))
    .filter(item => item.url && localFile(item.url));
  const scripts = [...htmlOriginal.matchAll(scriptTagPattern)]
    .map(match => ({ tag: match[0], url: getAttr(match[0], 'src') }))
    .filter(item => item.url && localFile(item.url));

  if (styles.length < 6 || scripts.length < 20) {
    throw new Error('Unexpected index.html manifest: refusing incomplete protected build');
  }
  if (scripts.some(item => !/\bdefer\b/i.test(item.tag))) {
    throw new Error('Non-deferred classic scripts require separate execution review');
  }

  // Keep order and boundaries of existing classic-script sources. Scene globals
  // remain global; the remaining section files are already independently scoped.
  // No module conversion, no async loading, no additional animation timers.
  const scriptParts = [];
  for (let i = 0; i < scripts.length; i++) {
    const file = localFile(scripts[i].url);
    const original = rewriteSourceArtwork(await readFile(path.join(root, file), 'utf8'));
    const compiled = await transform(original, {
      loader: 'js', target: 'safari15', charset: 'utf8',
      minifyWhitespace: true, minifySyntax: true,
      minifyIdentifiers: i !== 0, // keep globals from scene.js intact
      sourcemap: false, legalComments: 'none'
    });
    scriptParts.push(compiled.code);
  }
  const jsBody = scriptParts.join('\n;\n');
  const jsName = 'royal-' + hash(jsBody) + '.js';
  await writeFile(path.join(out, jsName), jsBody);

  // CSS @import must stay at the start of its original stylesheet. Group only
  // contiguous stylesheets without an @import to preserve cascade and fonts.
  const cssGroups = [];
  let current = [];
  for (const item of styles) {
    const source = rewriteSourceArtwork(await readFile(path.join(root, localFile(item.url)), 'utf8'));
    if (/@import\b/i.test(source)) {
      if (current.length) cssGroups.push(current);
      cssGroups.push([{ ...item, source }]);
      current = [];
    } else {
      current.push({ ...item, source });
    }
  }
  if (current.length) cssGroups.push(current);
  const generatedLinks = new Map();
  for (let i = 0; i < cssGroups.length; i++) {
    const group = cssGroups[i];
    const combined = group.map(x => x.source).join('\n');
    const minified = (await transform(combined, {
      loader: 'css', target: 'safari15', charset: 'utf8',
      minify: true, sourcemap: false, legalComments: 'none'
    })).code;
    const cssName = 'royal-style-' + (i + 1) + '-' + hash(minified) + '.css';
    await writeFile(path.join(out, cssName), minified);
    group.forEach((item, index) => generatedLinks.set(item.tag, index === 0
      ? '<link rel="stylesheet" href="' + cssName + '">'
      : ''));
  }

  let html = rewriteSourceArtwork(htmlOriginal);
  html = html.replace(cssTagPattern, tag => generatedLinks.has(tag) ? generatedLinks.get(tag) : tag);
  let inserted = false;
  const scriptTagSet = new Set(scripts.map(x => x.tag));
  html = html.replace(scriptTagPattern, tag => {
    if (!scriptTagSet.has(tag)) return tag;
    if (inserted) return '';
    inserted = true;
    return '<script src="' + jsName + '" defer></script>';
  });
  if (!inserted) throw new Error('Generated JavaScript was not linked');
  await writeFile(path.join(out, 'index.html'), html);

  // Ship opaque display assets and audio, not editable artwork or project code.
  const assetsDir = path.join(root, 'assets');
  try { if ((await stat(assetsDir)).isDirectory()) await copyPublishedMedia(assetsDir, 'assets'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }

  // Preserve WebPs used from the repository root, but do not publish raw PNGs.
  for (const item of await readdir(root, { withFileTypes: true })) {
    if (item.isFile() && /\.(?:webp|avif|mp3|m4a|ogg|woff2)$/i.test(item.name)) {
      await copyFile(path.join(root, item.name), path.join(out, item.name));
    }
  }
  let embeddedWebpsDecoded = 0;
  for (const [source, destination] of assetConversions) {
    const fullSource = path.join(root, source);
    const fullDestination = path.join(out, destination);
    await mkdir(path.dirname(fullDestination), { recursive: true });
    // Preserve the original, unmodified SVG's complete visual composition.
    // sharp's SVG renderer cannot paint data:image/webp, so normalize those
    // embedded images to lossless PNG in memory first, then flatten once.
    const prepared = await artworkRasterInput(fullSource);
    embeddedWebpsDecoded += prepared.embeddedWebpsDecoded;
    // This nine-sliced RSVP artwork has pixel-based CSS border-image-slice values
    // calibrated to its original 724×2172 SVG canvas. Rasterizing at 3x while
    // keeping those slice coordinates cuts the arch and the flowered footer.
    // Only this artwork must retain native SVG pixel dimensions; do not alter
    // any approved source artwork or reduce resolution on the other assets.
    const nativeSliceFrame = source.endsWith('/section-09/rsvp-royal-frame-paper.svg');
    const raster = sharp(prepared.input, {
      density: nativeSliceFrame ? 72 : 216, limitInputPixels: 100000000
    });
    await raster.webp({ quality: 92, alphaQuality: 100, effort: 4 }).toFile(fullDestination);
    await assertVisibleArtwork(fullDestination, source);
    if (nativeSliceFrame) {
      const { width, height } = await sharp(fullDestination).metadata();
      if (width !== 724 || height !== 2172) {
        throw new Error('RSVP nine-slice dimensions changed: ' + width + '×' + height);
      }
    }
  }

  const topLevelFiles = await readdir(out);
  if (topLevelFiles.some(name => /^(?:scene|section-|styles-bundle|golden-pagoda-).*\.js$/i.test(name))) {
    throw new Error('Readable source was copied into public output');
  }
  const report = {
    scriptsBundled: scripts.length,
    originalStyleFiles: styles.length,
    cssBundles: cssGroups.length,
    flattenedSourceImages: assetConversions.size,
    embeddedWebpsDecoded,
    publicDirectory: 'dist'
  };
  console.log(JSON.stringify(report, null, 2));
}
build().catch(error => { console.error(error); process.exitCode = 1; });
