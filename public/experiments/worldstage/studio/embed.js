import {mediaExtension} from './browser-store.js';
const publish=()=>parent.postMessage({type:'worldstage:height',height:document.documentElement.scrollHeight},location.origin);
new ResizeObserver(publish).observe(document.body);
publish();
// Blob downloads need a filename so the browser preserves the real container.
document.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(!link||!link.href.startsWith('blob:'))return;
  const extension=mediaExtension(link.href);
  link.download='worldstage-'+(extension==='json'?'performance':'film')+'.'+extension;
});
