/**
 * Strict static-asset release gate. No GitHub Actions required.
 * Run after scripts/build-protected.mjs before a production deploy.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const problems = [];
async function walk(dir, prefix = '') {
  let list = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) list = list.concat(await walk(path.join(dir, entry.name), relative));
    else if (entry.isFile()) list.push(relative);
  }
  return list;
}
async function validate() {
  const list = await walk(out);
  const html = await readFile(path.join(out, 'index.html'), 'utf8');
  const js = list.filter(x => /\.js$/i.test(x));
  const css = list.filter(x => /\.css$/i.test(x));
  const forbidden = list.filter(x => /\.(?:svg|map|png|jpe?g|ts|tsx|jsx|psd|ai|fig|json|md|mjs|cjs|ps1|txt)$/i.test(x)
    || /(?:^|\/)(?:reference|reference-dev|staging|assests|evidence|test-results|playwright-report)\//i.test(x));
  if (forbidden.length) problems.push('Forbidden output paths: ' + forbidden.slice(0, 12).join(', '));
  if (js.length !== 1 || !/^royal-[a-f0-9]{12}\.js$/.test(js[0] || '')) {
    problems.push('Expected one hashed application bundle; got: ' + js.join(', '));
  }
  if (css.length < 1 || css.length > 6 || css.some(x => !/^royal-style-\d+-[a-f0-9]{12}\.css$/.test(x))) {
    problems.push('Unexpected stylesheet output: ' + css.join(', '));
  }
  if (/<script\b[^>]*src=["'](?:scene|section-|golden-pagoda-)/i.test(html)
    || /<link\b[^>]*href=["']styles-bundle/i.test(html)) {
    problems.push('Readable source references remain in public HTML');
  }
  const bundleTags = (html.match(/<script\b[^>]*\bsrc=["']royal-[a-f0-9]{12}\.js["'][^>]*>/gi) || []);
  if (bundleTags.length !== 1) problems.push('HTML does not reference exactly one hashed JavaScript bundle');
  if (!html.includes('invitation-cover-locked')) problems.push('First-paint iPhone cover scroll guard missing');
  const publicSet = new Set(list);
  for (const file of ['index.html', ...js, ...css]) {
    const text = await readFile(path.join(out, file), 'utf8');
    const converted = text.match(/(?:\.\/)?assets\/[A-Za-z0-9._/-]+\.(?:svg|png|jpe?g)\.webp/g) || [];
    for (const item of converted) {
      const target = item.replace(/^\.\//, '');
      if (!publicSet.has(target)) problems.push('Converted image missing: ' + target);
    }
    if (/sourceMappingURL\s*=/.test(text)) problems.push('Source map reference detected in ' + file);
  }
  // Check allowlisted output has no original source code apart from bundle(s).
  if (problems.length) {
    for (const problem of problems) console.error('FAIL ' + problem);
    process.exitCode = 1;
    return;
  }
  console.log('Protected output verified: 1 JavaScript bundle, ' + css.length
    + ' minified CSS bundle(s), ' + list.length + ' total public files, no editable SVGs or source maps.');
}
validate().catch(error => { console.error(error); process.exitCode = 1; });
