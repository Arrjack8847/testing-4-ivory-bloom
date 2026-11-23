#!/usr/bin/env node
// Build the Section 1 preview from audited, unmodified WebP files.
import {spawnSync} from 'node:child_process';
import {copyFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
const root=resolve('.');
const check=spawnSync(process.execPath,[join(root,'scripts/prepare-section1-assets.mjs')],{cwd:root,encoding:'utf8'});
if(check.status!==0){
  console.error(check.stderr||check.stdout||'Section 1 asset staging failed');
  process.exit(1);
}
const out=join(root,'dist');
mkdirSync(out,{recursive:true});
copyFileSync(join(root,'index.html'),join(out,'index.html'));
writeFileSync(join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Built Ivory Bloom S1 with the original 20 WebPs, byte-for-byte unchanged.');
