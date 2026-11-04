// Presentation hooks only: source copy, images and project-specific interactions stay intact.
export function decoratePortfolioDocument(html){
  const ruled=new Set(['rh-work','rh-open-experiments','rh-dungeon','rh-lab','rh-specimen','sx-pad','sx-principles','eb-chapter','xc-chapter','ns-evidence','xc-pad','dg-method','dg-observations','dg-reading','dg-findings','gs-method']);
  html=html.replace(/<section\b([^>]*\bclass="([^"]+)"[^>]*)>/g,(tag,attributes,classes)=>{
    if(!classes.split(/\s+/).some(name=>ruled.has(name)))return tag;
    if(classes.split(/\s+/).includes('rh-work'))return `<section${attributes} data-story-section>`;
    return `<section${attributes} data-story-section><span data-story-rule aria-hidden="true"></span>`;
  });
  html=html.replace(/<header\b([^>]*class="(?:rh-header|rd-header|sx-header|eb-header|xc-header)"[^>]*)>/g,'<header$1 data-site-header>');
  html=html.replace(/<h2\b/g,'<h2 data-story-intro');
  // Case colophons were nested in main. Keep their full-width chrome outside the capped story.
  html=html.replace(/(<footer\b[^>]*class="(?:sx-footer[^"\n]*|eb-footer|xc-footer)"[\s\S]*?<\/footer>)\s*<\/main>/g,'</main>$1');
  return html;
}
