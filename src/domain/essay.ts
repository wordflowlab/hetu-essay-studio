import { canonical, requireValue as need } from '../../vendor/project-store.ts';
import { digest, find, fixedHistory, ordered, unique, checkNotes } from './shared.ts';

export interface Evidence { id:string; label:string; source_index:number; byte_start:number; byte_end:number; quote:string }
export interface Observation { id:string; label:string; text:string; mode:'observed'|'memory'|'invented'|'borrowed'; context:string; evidence_ids:string[] }
export interface Motif { id:string; name:string; description:string }
export interface Fragment { id:string; title:string; text:string; mode:'scene'|'reflection'|'transition'|'image'; observation_ids:string[]; observations_sha256:string; motif_ids:string[]; intent:string }
export interface Occurrence { id:string; fragment_id:string; order:number }
export interface Arrangement { id:string; title:string; items:Occurrence[]; fragments_sha256:string; rationale:string }
export interface Variant { id:string; fragment_id:string; fragment_sha256:string; text:string; rationale:string }
export interface Note { id:string; target_kind:'fragment'|'arrangement'; target_id:string; target_sha256:string; origin:'author'|'agent'; comment:string; status:'open'|'resolved'; resolution:string }
export interface Essay { format_version:1; title:string; brief:string; evidence:Evidence[]; observations:Observation[]; motifs:Motif[]; fragments:Fragment[]; arrangements:Arrangement[]; variants:Variant[]; notes:Note[]; basis_refs:unknown[] }

export function observationsDigest(p:Essay, ids:string[]) {
  unique(ids,'观察引用重复。');
  return digest(ids.map(id=>find(p.observations,id,'观察')));
}
export function arrangementDigest(p:Essay, items:Occurrence[]) {
  unique(items.map(x=>x.id),'独立出场ID重复。');
  unique(items.map(x=>x.order),'独立出场顺序重复。');
  return digest(ordered(items).map(item=>({occurrence:item,fragment:find(p.fragments,item.fragment_id,'片段')})));
}
export const fragmentDigest=(fragment:Fragment)=>digest(fragment);
export function targetDigest(p:Essay, kind:string, id:string) {
  if(kind==='fragment') return fragmentDigest(find(p.fragments,id,'片段'));
  need(kind==='arrangement','未知意见目标。');
  const arrangement:Arrangement=find(p.arrangements,id,'编排');
  return digest({arrangement,current_fragments_sha256:arrangementDigest(p,arrangement.items)});
}
export function validateEssay(p:Essay) {
  for(const e of p.evidence) need(e.byte_end>e.byte_start,'引文字节范围为空或逆序。');
  for(const o of p.observations) {
    unique(o.evidence_ids,'观察引文重复。');
    o.evidence_ids.forEach(id=>find(p.evidence,id,'固定引文'));
  }
  for(const f of p.fragments) {
    observationsDigest(p,f.observation_ids);
    unique(f.motif_ids,'片段意象重复。');
    f.motif_ids.forEach(id=>find(p.motifs,id,'意象'));
  }
  for(const a of p.arrangements) arrangementDigest(p,a.items);
  for(const v of p.variants) find(p.fragments,v.fragment_id,'片段');
  checkNotes(p,(kind,id)=>targetDigest(p,kind,id));
}
/** 不改变旧绑定时可以保留过期依据；新建或主动调整绑定必须核对当前内容。 */
export function validateEssayTransition(next:Essay, prev?:Essay) {
  fixedHistory(next,prev,['evidence','observations']);
  for(const f of next.fragments) {
    const old=prev?.fragments.find(x=>x.id===f.id);
    if(!old || old.observations_sha256!==f.observations_sha256 || canonical(old.observation_ids)!==canonical(f.observation_ids))
      need(f.observations_sha256===observationsDigest(next,f.observation_ids),'片段观察依据摘要不符。','hetu.stale_evidence');
  }
  for(const a of next.arrangements) {
    const old=prev?.arrangements.find(x=>x.id===a.id);
    if(!old || old.fragments_sha256!==a.fragments_sha256 || canonical(old.items)!==canonical(a.items))
      need(a.fragments_sha256===arrangementDigest(next,a.items),'编排片段依据摘要不符。','hetu.stale_evidence');
  }
  for(const v of next.variants) {
    const old=prev?.variants.find(x=>x.id===v.id);
    if(!old || old.fragment_sha256!==v.fragment_sha256 || old.fragment_id!==v.fragment_id)
      need(v.fragment_sha256===fragmentDigest(find(next.fragments,v.fragment_id,'片段')),'备选的原片段已经变化。','hetu.stale_evidence');
  }
  for(const n of next.notes) {
    const old=prev?.notes.find(x=>x.id===n.id);
    if(!old || canonical([old.target_kind,old.target_id,old.target_sha256])!==canonical([n.target_kind,n.target_id,n.target_sha256]))
      need(n.target_sha256===targetDigest(next,n.target_kind,n.target_id),'意见的固定目标摘要不符。','hetu.stale_evidence');
  }
}
export function arrangementReport(p:Essay) {
  return p.arrangements.map(a=>({id:a.id,title:a.title,occurrences:a.items.length,stale:a.fragments_sha256!==arrangementDigest(p,a.items)}));
}
export function previewArrangement(p:Essay,id:string) {
  const a:Arrangement=find(p.arrangements,id,'编排');
  return {arrangement:a,stale:a.fragments_sha256!==arrangementDigest(p,a.items),occurrences:ordered(a.items).map(item=>({occurrence:item,fragment:find(p.fragments,item.fragment_id,'片段')}))};
}
export function motifReport(p:Essay) {
  return p.motifs.map(m=>({motif:m,arrangements:p.arrangements.map(a=>({id:a.id,title:a.title,occurrences:ordered(a.items).filter(i=>find(p.fragments,i.fragment_id,'片段').motif_ids.includes(m.id)).map(i=>({occurrence_id:i.id,order:i.order,fragment_id:i.fragment_id,title:find(p.fragments,i.fragment_id).title}))})),note:'位置与次数描述明确标记，不判断文学品质。'}));
}
export function checkEssay(p:Essay) {
  return {
    stale_fragment_ids:p.fragments.filter(f=>f.observations_sha256!==observationsDigest(p,f.observation_ids)).map(f=>f.id),
    stale_arrangement_ids:arrangementReport(p).filter(a=>a.stale).map(a=>a.id),
    stale_variant_ids:p.variants.filter(v=>v.fragment_sha256!==fragmentDigest(find(p.fragments,v.fragment_id))).map(v=>v.id),
    stale_note_ids:p.notes.filter(n=>n.target_sha256!==targetDigest(p,n.target_kind,n.target_id)).map(n=>n.id),
    unarranged_fragment_ids:p.fragments.filter(f=>!p.arrangements.some(a=>a.items.some(i=>i.fragment_id===f.id))).map(f=>f.id),
    unused_observation_ids:p.observations.filter(o=>!p.fragments.some(f=>f.observation_ids.includes(o.id))).map(o=>o.id),
    note:'缺口不妨碍自由散文创作；检查只揭示明确结构与依据变化。'
  };
}
export function applyVariant(p:Essay,id:string) {
  const v:Variant=find(p.variants,id,'备选'),fragment:Fragment=find(p.fragments,v.fragment_id,'片段');
  need(v.fragment_sha256===fragmentDigest(fragment),'原片段已经变化，请重新比较备选。','hetu.stale_evidence');
  fragment.text=v.text;
}
export function essayText(p:Essay) {
  return p.title+'\n\n'+p.arrangements.map(a=>a.title+'\n\n'+previewArrangement(p,a.id).occurrences.map(x=>x.fragment.text).join('\n\n')+(a.fragments_sha256!==arrangementDigest(p,a.items)?'\n\n〔编排依据已变化，需复核〕':'')).join('\n\n────────\n\n');
}
