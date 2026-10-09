import { BOTANY } from './fugenduellBotany';
import rootData from './fugenduellRootTraits.json';
import pladiasData from './fugenduellScientificTraits.json';

export interface BotanicalSkill {
 id: string;
 nameDe: string;
 nameEn: string;
 descriptionDe: string;
 descriptionEn: string;
 values: Array<{ labelDe: string; labelEn: string; value: number | string; unit: string; source: string; field: string }>;
 source: string;
 scope: string;
}
const roots = rootData.records as Record<string,{taxon:string;matched:boolean;values:Record<string,number|null>}>;
const pladias = pladiasData as Record<string,{source:string;values:Record<string,string>}>;
const rootLabels: Record<string,[string,string,string]> = {
 RDepth:['Wurzeltiefe (Artenmittel maximal beobachteter Tiefen)','Root depth (species mean of observed maxima)','m'],
 LRExtent:['Seitliche Wurzelausdehnung (Radius, Artenmittel)','Lateral root extent (radius, species mean)','m'],
 BBsize:['Knospenbank (Artenmittel)','Bud bank (species mean)','buds'],
};
export function rootDepth(id: string): number | null { return roots[id]?.values.RDepth ?? null; }
export function scientificCsr(id: string): string | null { return pladias[id]?.values['Life strategy (Pierce method based on leaf traits)'] ?? null; }
export function rootSkill(id: string): BotanicalSkill {
 const values=Object.entries(roots[id]?.values || {}).filter((entry): entry is [string,number] => entry[1] !== null).map(([field,value])=>({labelDe:rootLabels[field][0],labelEn:rootLabels[field][1],value,unit:rootLabels[field][2],source:rootData.source,field}));
 return {id:'belowground',nameDe:'Unterirdisches System',nameEn:'Belowground system',descriptionDe:'Gemessene unterirdische Merkmale; keine Wurzelpunkte. Fehlende Messwerte werden nicht ergänzt.',descriptionEn:'Measured belowground traits; no root points. Missing measurements are not filled in.',values,source:rootData.source,scope:'UNDERPLOT v39, Bruelheide et al. (2026), DOI '+rootData.doi+'. Species means; RDepth/LRExtent originate in RSIP, bud bank in CLO-PLA. Buds per shoot in clonal plants, per rooting unit in non-clonal plants. Taraxacum retains the dataset’s aggregated taxon scope.'};
}
function fact(id:string,index:number,nameDe:string,nameEn:string): BotanicalSkill {
 const p=BOTANY[id], f=p.facts[index];
 if (!f) throw new Error('Missing verified fact '+id+' '+index);
 return {id:'fact-'+index,nameDe,nameEn,descriptionDe:f[1],descriptionEn:f[2],values:[],source:p.source,scope:p.scope};
}
function trait(id:string,key:string,nameDe:string,nameEn:string): BotanicalSkill {
 const p=pladias[id]; const value=p?.values[key];
 if (!value) throw new Error('Missing verified trait '+id+' '+key);
 return {id:key,nameDe,nameEn,descriptionDe:'Dokumentiertes botanisches Merkmal; kein Spielbonus.',descriptionEn:'Documented botanical trait; no game bonus.',values:[{labelDe:nameDe,labelEn:nameEn,value,unit:'',source:p.source,field:key}],source:p.source,scope:'Pladias, Czech flora; original references and trait definitions on source page.'};
}
/** Four evidenced botanical traits per species. Names do not imply measured performance or exclusivity. */
export function botanicalSkills(id:string): BotanicalSkill[] {
 switch(id) {
 case 'taraxacum-officinale':return [rootSkill(id),fact(id,0,'Pfahlwurzel und Rosette','Taproot and rosette'),fact(id,2,'Windfrüchte','Wind dispersal'),fact(id,3,'Breite Bodenreaktion','Broad soil reaction')];
 case 'plantago-major':return [rootSkill(id),fact(id,0,'Bodennahe Rosette','Low rosette'),fact(id,2,'Verdichteter Boden','Compacted soil'),trait(id,'Growth form','Klonales Kraut','Clonal herb')];
 case 'poa-annua':return [rootSkill(id),fact(id,0,'Flexibler Lebenszyklus','Variable life cycle'),fact(id,2,'Langlebige Samenbank','Persistent seed bank'),trait(id,'Flowering period [month]','Ganzjähriges Blühfenster','Year-round flowering window')];
 case 'cardamine-hirsuta':return [rootSkill(id),fact(id,0,'Mehrere Generationen','Multiple generations'),fact(id,1,'Schleuderschoten','Explosive pods'),trait(id,'Flowering period [month]','Frühlingsblüte','Spring flowering')];
 case 'cymbalaria-muralis':return [fact(id,0,'Bewurzelnde Kriechstängel','Rooting creeping stems'),fact(id,2,'Fugenbewohner','Crevice dweller'),trait(id,'Flowering period [month]','Langes Blühfenster','Extended flowering window'),trait(id,'Height [m]','Kleine Wuchsform','Small stature')];
 case 'asplenium-ruta-muraria':return [fact(id,0,'Immergrüner Sporenfarn','Evergreen spore fern'),fact(id,2,'Fels- und Mauerfugen','Rock and wall crevices'),rootSkill(id),trait(id,'Height [m]','Kompakte Wedel','Compact fronds')];
 case 'bryum-argenteum':return [fact(id,0,'Winzige Sprosse','Tiny shoots'),fact(id,1,'Kleine Blätter','Small leaves'),fact(id,2,'Silbrige Polster','Silvery tufts'),fact(id,3,'Gestörte Standorte','Disturbed sites')];
 case 'portulaca-oleracea':return [rootSkill(id),fact(id,1,'Fleischige Blätter (Gattung)','Fleshy leaves (genus)'),trait(id,'Growth form','Einjähriger Lebenszyklus','Annual life cycle'),trait(id,'Height [m]','Niedriger Wuchs','Low stature')];
 case 'erigeron-canadensis':return [rootSkill(id),fact(id,0,'Rosette zum aufrechten Spross','Rosette to erect stem'),fact(id,1,'Hoher Spross','Tall stem'),fact(id,2,'Kleine Blütenköpfe','Small flower heads')];
 case 'chelidonium-majus':return [rootSkill(id),fact(id,2,'Orangefarbener Milchsaft','Orange sap'),trait(id,'Growth form','Mehrmalige Fortpflanzung','Repeated reproduction'),trait(id,'Flowering period [month]','Sommerliches Blühfenster','Summer flowering window')];
 case 'sagina-procumbens':return [rootSkill(id),fact(id,0,'Mehrjähriges Kraut','Perennial herb'),fact(id,2,'Kleine Blätter','Small leaves'),trait(id,'Flowering period [month]','Langes Blühfenster','Extended flowering window')];
 case 'cochlearia-danica':return [rootSkill(id),fact(id,0,'Kurzer Lebenszyklus','Short life cycle'),fact(id,1,'Küstenherkunft','Coastal native range'),trait(id,'Flowering period [month]','Frühsommerblüte','Early summer flowering')];
 case 'buddleja-davidii':return [fact(id,0,'Sommergrüner Strauch','Deciduous shrub'),fact(id,1,'Hoher Wuchs','Tall stature'),fact(id,2,'Große Blätter','Large leaves'),fact(id,3,'Beschriebene Trockenheitsresistenz','Described drought resistance')];
 case 'ailanthus-altissima':return [fact(id,0,'Baum mit Wurzelausläufern','Tree with suckers'),fact(id,1,'Hoher Baumwuchs','Tall tree stature'),fact(id,2,'Geflügelte Früchte','Winged fruits'),trait(id,'Flowering period [month]','Frühsommerblüte','Early summer flowering')];
 default:throw new Error('Unknown botanical taxon '+id);
 }
}
