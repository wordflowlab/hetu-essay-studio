import {names} from './terms.ts';
import { artifact } from './artifact.ts';
import { find } from './shared.ts';
import { validateEssay,validateEssayTransition,observationsDigest,arrangementDigest,fragmentDigest,targetDigest,checkEssay,previewArrangement,arrangementReport,motifReport,applyVariant,essayText } from './essay.ts';
export const validateDomain=validateEssay;
export function validateTransition(next:any,prev?:any,_action?:string) { validateEssayTransition(next,prev); }
export async function checkSources(_p:any,_sources:any[],..._rest:any[]){}
export async function pureAction(_a:string,_i:any) { return undefined; }
export async function writeProfessional(a:string,p:any,_sources:any[],i:any,..._rest:any[]) {
  if(a==='apply_variant') return applyVariant(p,i.variant_id);
  throw Error('未知专业写动作。');
}
export function summaries(p:any) {
  return [
    {title:'创作目标',lines:[p.brief]},
    {title:'完整散文与编排',lines:[essayText(p)]},
    {title:'编排理由',lines:p.arrangements.map((a:any)=>a.title+'：'+a.rationale)},
    {title:'原始观察',lines:p.observations.map((o:any)=>o.label+'〔'+names[o.mode]+'〕\n'+o.text+'\n'+o.context)},
    {title:'意象',lines:p.motifs.map((m:any)=>m.name+'：'+m.description)},
    {title:'全部片段',lines:p.fragments.map((f:any)=>f.title+'\n'+f.text+'\n写作意图：'+f.intent)},
    {title:'固定引文',lines:p.evidence.map((e:any)=>e.label+'：“'+e.quote+'”\n来源'+e.source_index+' 字节'+e.byte_start+'～'+e.byte_end)},
    {title:'备选与理由',lines:p.variants.map((v:any)=>v.text+'\n'+v.rationale)},
    {title:'固定意见',lines:p.notes.map((n:any)=>n.comment+'；'+names[n.status]+' '+n.resolution)},
    {title:'依据复核',lines:[JSON.stringify(checkEssay(p),null,2)]}
  ];
}
export async function readProfessional(a:string,p:any,_sources:any[],i:any,..._rest:any[]) {
  if(a==='target_digest') return {target_sha256:targetDigest(p,i.target_kind,i.target_id)};
  if(a==='check_essay') return checkEssay(p);
  if(a==='fragment_basis') return {observation_ids:i.observation_ids,observations_sha256:observationsDigest(p,i.observation_ids)};
  if(a==='arrangement_basis') return {items:i.items,fragments_sha256:arrangementDigest(p,i.items)};
  if(a==='preview_arrangement') return previewArrangement(p,i.arrangement_id);
  if(a==='arrangement_report') return {arrangements:arrangementReport(p)};
  if(a==='motif_report') return {motifs:motifReport(p)};
  if(a==='compare_arrangements') return {from:previewArrangement(p,i.from_id),to:previewArrangement(p,i.to_id),note:'比较次序和具体文本，不自动决定优劣。'};
  if(a==='export_essay') return {...artifact(essayText(p),'散文阅读本.txt','text/plain',i),losses:['阅读本按所有编排分别输出，未采用片段和原始依据另见完整工程。']};
  if(a==='export_review') { const {reportHTML}=await import('./report.ts');return artifact(reportHTML({project:p}),'散文审核本.html','text/html',i); }
}
