'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');

test('Section 9 text refinement loads last and stays royal-skin scoped',()=>{
 const html=read('index.html');
 const css=read('golden-pagoda-s09-text-layout.css');
 assert.match(html,/href="golden-pagoda-s09-text-layout\.css"/);
 assert.ok(html.lastIndexOf('golden-pagoda-s09-text-layout.css') > html.lastIndexOf('golden-pagoda-s05-s10-royal-wording.css'));
 assert.ok(css.includes('html[data-golden-pagoda-skin="true"] #rsvp'));
 assert.doesNotMatch(css,/url\(/);
});
test('Long Myanmar RSVP labels and wishes use readable line heights without clipping',()=>{
 const css=read('golden-pagoda-s09-text-layout.css');
 assert.match(css,/h2\.s9-heading\.royal-my-text/);
 assert.match(css,/\.s9-wish p\.royal-my-text/);
 assert.match(css,/\.s9-demo-note\.royal-my-text/);
 assert.match(css,/position: static/);
 assert.match(css,/font: 400 16px\/1\.55/);
 assert.match(css,/text-wrap: balance/);
});
test('Native form controls are not modified and 320–430 mobile values have full-width rows',()=>{
 const html=read('index.html');
 const css=read('golden-pagoda-s09-text-layout.css');
 for(const id of ['s9Name','s9Attendance','s9Guests','s9Wish','s9RsvpForm','s9ShareWish'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(css,/@media \(max-width: 480px\)/);
 assert.match(css,/\.s9-row2\s*\{\s*grid-template-columns: minmax\(0, 1fr\)/);
 assert.match(read('section-nine.js'),/RSVP preview \(not sent or saved\)/);
});
test('Approved Section 9 frame and fill are still referenced unchanged',()=>{
 const css=read('golden-pagoda-s09-review.css');
 assert.match(css,/rsvp-royal-frame-paper\.svg/);
 assert.match(css,/border-image-slice: 340 45 225 45 fill/);
 assert.match(css,/border-image-repeat: stretch/);
});
