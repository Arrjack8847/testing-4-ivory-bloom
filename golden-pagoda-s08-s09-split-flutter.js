/* Progressive enhancement: do not alter original butterflies if split images are missing. */
(function(){
 const base='assets/skins/golden-pagoda-garden/';
 function ready(url){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=url;});}
 function activate(section,root,stem){
   const paths=['left-wing','right-wing','body'].map(part=>base+section+'/'+stem+'-butterfly-'+part+'.webp');
   Promise.all(paths.map(ready)).then(ok=>{
     if(!ok.every(Boolean))return; // Retain original artwork when any component fails.
     const target=document.querySelector(root);
     if(!target)return;
     target.classList.add('gp-'+(section==='section-08'?'s08':'s09')+'-split-ready');
     if(section==='section-09' && new URLSearchParams(location.search).get('skin')==='golden-pagoda-garden'){
       installBottomPair(target);
     }
   });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();

 /* The top pair are the original two S09 elements. Add a separate bottom pair
    only for Golden Pagoda, reusing the verified S09 WebPs and Section 9's
    original opposite-direction 13s/16s flight keyframes. */
 function installBottomPair(section){
   if(section.querySelector('.s9-bottom-butterfly-zone'))return;
   const zone=document.createElement('div');
   zone.className='s9-bottom-butterfly-zone';
   zone.setAttribute('aria-hidden','true');
   zone.innerHTML=
     '<div class="s9-butterfly s9-butterfly-bottom-reverse"><i class="s9-wing s9-wing-left"></i><i class="s9-wing s9-wing-right"></i></div>'+
     '<div class="s9-butterfly-forward s9-butterfly-bottom-forward"><i class="s9-wing s9-wing-left"></i><i class="s9-wing s9-wing-right"></i></div>';
   section.insertBefore(zone,section.querySelector('.s9-inner'));
   if('IntersectionObserver' in window){
     const observer=new IntersectionObserver(entries=>{
       section.classList.toggle('gp-s09-bottom-in-view',entries.some(entry=>entry.isIntersecting));
     },{threshold:0,rootMargin:'64px 0px 64px 0px'});
     observer.observe(zone);
   }else{
     section.classList.add('gp-s09-bottom-in-view');
   }
 }
 function run(){
   // Split royal wing sprites belong only to Golden Pagoda. The default
   // Testing-4 invitation must retain its own butterfly assets and motion.
   if(new URLSearchParams(location.search).get('skin')!=='golden-pagoda-garden')return;
   const sections=[
     {section:'section-08',selector:'#weddingGift',stem:'s08'},
     {section:'section-09',selector:'#rsvp',stem:'s09'}
   ];
   // Six transparent parts are decorative, not cover-critical. Prewarm them
   // when their section comes within two viewports; keep existing paths and
   // hinges untouched. The no-IO fallback retains the old eager behavior.
   if(typeof IntersectionObserver!=='function'){
     sections.forEach(item=>activate(item.section,item.selector,item.stem));
     return;
   }
   const pending=new Map();
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(!entry.isIntersecting)continue;
       const item=pending.get(entry.target);
       if(!item)continue;
       pending.delete(entry.target);
       observer.unobserve(entry.target);
       activate(item.section,item.selector,item.stem);
     }
     if(!pending.size)observer.disconnect();
   },{rootMargin:'200% 0px 200% 0px',threshold:0});
   for(const item of sections){
     const element=document.querySelector(item.selector);
     if(!element)continue;
     pending.set(element,item);
     observer.observe(element);
   }
 }
})();