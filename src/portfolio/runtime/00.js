(()=>{
 const key='josh-cole-portfolio-v1';
 const persistent=value=>{
  if(value?.modelContent?.kind!=='culture-case-studies')return value;
  const modelContent={...value.modelContent};delete modelContent.structure;
  return {...value,modelContent};
 };
 let snapshot={modelContent:null,privateContent:{}};
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&typeof saved==='object')snapshot=persistent(saved);}catch{}
 window.portfolioStore={widgetState:snapshot,setWidgetState:async value=>{
  snapshot=value;window.portfolioStore.widgetState=value;
  try{localStorage.setItem(key,JSON.stringify(persistent(value)));}catch{}
 }};
})();
