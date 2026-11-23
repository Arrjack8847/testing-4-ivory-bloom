#!/usr/bin/env node
/** Assemble exactly 20 Ivory Bloom S1 assets into dist, preserving original bytes.
 * Usage: node scripts/prepare-section1-assets.mjs
 * Optional: IVORY_SOURCE_ROOT and IVORY_OUTPUT_ROOT environment variables.
 * This is an asset-only gate, NOT an application build or full image decoder.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync, realpathSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { createHash } from 'node:crypto';
const EXPECTED=Object.freeze({
 'sky.webp':[1080,1920], 'palace-horizontal.webp':[1448,1086],
 'arch.webp':[941,1672], 'drape.webp':[1024,1536],
 'hang_1.webp':[1024,1536], 'hang_3.webp':[1024,1536],
 'hang_4.webp':[1024,1536], 'peacock.webp':[1024,1536],
 'spike_3.webp':[768,1536], 'spike_4.webp':[768,1536],
 'spike_5.webp':[768,1536], 'stem_1.webp':[768,1536],
 'stem_2.webp':[768,1536], 'leaf_4.webp':[1536,1024],
 'leaf_5.webp':[1536,1024], 'leaf_6.webp':[1536,1024],
 'bfly_1.webp':[312,246], 'bfly_white.webp':[312,246],
 'royal-name-divider.webp':[690,36], 'royal-open-button.webp':[663,147]
});
const ROOT=resolve(process.env.IVORY_SOURCE_ROOT||process.cwd());
const OUTPUT=resolve(process.env.IVORY_OUTPUT_ROOT||join(ROOT,'dist'));
const DIRS=['public/assets/ivory-bloom','assets/skins/ivory-bloom'];
function sizeOf(data){
 if(data.length<30||data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WEBP')
  throw Error('Invalid WebP RIFF header');
 const chunk=data.toString('ascii',12,16);
 if(chunk==='VP8X')return{w:1+data.readUIntLE(24,3),h:1+data.readUIntLE(27,3),alpha:!!(data[20]&16)};
 if(chunk==='VP8L'){
  const bits=data.readUInt32LE(21);
  return{w:1+(bits&0x3fff),h:1+((bits>>>14)&0x3fff),alpha:!!((bits>>>28)&1)};
 }
 if(chunk==='VP8 ')return{w:data.readUInt16LE(26)&0x3fff,h:data.readUInt16LE(28)&0x3fff,alpha:false};
 throw Error('Unsupported WebP format '+chunk);
}
const failures=[], files=[];
for(const [filename,[w,h]] of Object.entries(EXPECTED)){
 const matches=DIRS.map(d=>join(ROOT,d,filename)).filter(existsSync);
 if(matches.length!==1){failures.push(filename+': expected exactly one source, found '+matches.length);continue;}
 try{
  const src=realpathSync(matches[0]);
  const root=realpathSync(ROOT);
  if(!src.startsWith(root+'/')||!statSync(src).isFile())throw Error('Invalid source path');
  const data=readFileSync(src),actual=sizeOf(data);
  if(actual.w!==w||actual.h!==h)throw Error('wrong size '+actual.w+'x'+actual.h+', required '+w+'x'+h);
  if(filename!=='sky.webp'&&!actual.alpha)throw Error('missing alpha flag');
  files.push({filename,source:relative(ROOT,src).replaceAll('\\','/'),
   size:[w,h],alpha:actual.alpha,bytes:data.length,
   sha256:createHash('sha256').update(data).digest('hex')});
 }catch(e){failures.push(filename+': '+e.message);}
}
if(failures.length){console.error('SECTION 1 BLOCKED:\n'+failures.join('\n'));process.exit(1);}
const out=join(OUTPUT,'assets/ivory-bloom');
if(out.startsWith(ROOT+'/assets/')||out.startsWith(ROOT+'/public/assets/'))
 throw Error('Refusing to overwrite original artwork directories');
mkdirSync(out,{recursive:true});
for(const file of files)copyFileSync(join(ROOT,file.source),join(out,file.filename));
writeFileSync(join(out,'asset-integrity.json'),JSON.stringify({project:'Ivory Bloom Section 1',count:files.length,files},null,2)+'\n');
console.log('STAGED '+files.length+'/20 assets, byte-for-byte unchanged: '+out);
