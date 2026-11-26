// Static catalog validation for the Fresnica full wallet UI design prototype.
import { coreGroups } from "./wallet-prototype-core.js";
import { extraGroups } from "./wallet-prototype-extra.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const dir=path.dirname(fileURLToPath(import.meta.url));
const groups=[...coreGroups,...extraGroups];
const pages=groups.flatMap(g=>g.pages);
const ids=new Set(pages.map(p=>p.id));
const requiredGroups=["home","send","request","swap","activity","actions","dapps","assets","markets","accounts","book","onboard","settings","scan","states","extensions"];
const supported=new Set(["home","list","choice","form","detail","review","result","auth","qr","swap","activity","actions","browser","welcome","backup","unlock","settings","scan","state"]);
const errors=[];
for(const section of requiredGroups)if(!groups.some(g=>g.id===section))errors.push("missing group "+section);
if(pages.length<110)errors.push("Expected comprehensive catalog, got "+pages.length);
if(ids.size!==pages.length)errors.push("Duplicate page ids");
for(const page of pages){
  if(!page.id||!page.title||!page.cn||!supported.has(page.kind))errors.push("Incomplete page "+page.id);
  for(const a of [page.primary,page.secondary].filter(Boolean)){if(!ids.has(a.to))errors.push(page.id+" -> "+a.to);}
  for(const row of page.rows||[])if(row[3]&&!ids.has(row[3]))errors.push(page.id+" -> row "+row[3]);
}
const html=readFileSync(path.join(dir,"wallet-prototype.html"),"utf8");
const css=readFileSync(path.join(dir,"wallet-prototype.css"),"utf8");
const js=readFileSync(path.join(dir,"wallet-prototype.js"),"utf8");
for(const source of ["wallet-prototype.js","wallet-prototype.css"])if(!html.includes(source))errors.push("Missing HTML reference "+source);
for(const source of ["wallet-prototype-core.js","wallet-prototype-extra.js"])if(!js.includes(source))errors.push("Missing catalog import "+source);
for(const token of ["#0F7954","#F9F9FB","#E8F3ED","#1A1C1D"])if(!css.includes(token))errors.push("Missing brand token "+token);
for(const legacy of ["mobile-demo.html","wallet-home.html"])if(!js.includes(legacy))errors.push("Missing legacy link "+legacy);
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Fresnica wallet UI catalog verified:",pages.length,"screens across",groups.length,"groups. Navigation and styles present.");
