import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.join(root,'public/portfolio/licenses');fs.mkdirSync(destination,{recursive:true});
const fonts={
 'geist-ofl.txt':'https://raw.githubusercontent.com/vercel/geist-font/main/OFL.txt',
 'newsreader-ofl.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/OFL.txt',
 'syne-ofl.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/syne/OFL.txt',
 'inter-ofl.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt',
 'jetbrains-mono-ofl.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt',
};
for(const[name,url]of Object.entries(fonts)){
 const response=await fetch(url);if(!response.ok)throw Error(url+' '+response.status);const text=await response.text();if(!text.includes('SIL OPEN FONT LICENSE'))throw Error('Unexpected font license '+url);fs.writeFileSync(path.join(destination,name),text);
}
for(const[name,file]of [['react-mit.txt','react/LICENSE'],['next-mit.txt','next/license.md'],['lucide-isc.txt','lucide-react/LICENSE']]){
 const source=path.join(root,'node_modules',file);fs.copyFileSync(source,path.join(destination,name));
}
console.log('Open-source font and runtime licenses preserved.');
