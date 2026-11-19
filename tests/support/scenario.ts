import {createHash} from 'node:crypto';
import {newProject} from '../../src/domain/model.ts';
export const original='雨停后，灯还亮着。她把没有寄出的信放回抽屉。\n评论者说：灯象征没有终结的等待。\n';
export const sha=(s:string|Uint8Array)=>createHash('sha256').update(s).digest('hex');
export const base=(r:any,key:string)=>({object_id:r.object.object_id,expected_revision:r.object.revision,expected_sha256:r.sha256,operation_key:key});
export const selection=(r:any)=>({object_id:r.object.object_id,revision:r.object.revision});
export const range=(quote:string)=>{const start=original.indexOf(quote);if(start<0)throw Error('fixture quote');return {source_index:0,byte_start:Buffer.byteLength(original.slice(0,start)),byte_end:Buffer.byteLength(original.slice(0,start+quote.length)),quote};};
export const sourceRef={kind:'resource',work_ref:{workspace_id:'workspace_test',kind:'novel',object_id:'novel_test'},resource_id:'resource_test',revision:1,sha256:sha(original)};
import {observationsDigest,arrangementDigest,fragmentDigest,targetDigest} from '../../src/domain/essay.ts';
export function scenario():any {
 const p=newProject('灯下的来信');p.brief='把观察、记忆和虚构分开，用同样片段准备两种次序，比较雨与灯的距离。';
 p.evidence=[{id:'rain',label:'雨停后的灯',...range('雨停后，灯还亮着。')},{id:'letter',label:'没有寄出的信',...range('她把没有寄出的信放回抽屉。')}];
 p.observations=[{id:'observed',label:'站台的灯',text:'雨停后仍亮着的一盏灯。',mode:'observed',context:'原创虚构资料中的观察声明，不是真人现场记录。',evidence_ids:['rain']},{id:'memory',label:'母亲的来信',text:'记忆中的信纸有折痕，日期已经模糊。',mode:'memory',context:'叙述者记忆，不补作确定事实。',evidence_ids:['letter']},{id:'invented',label:'虚构的等待',text:'假想一个没有到站的人。',mode:'invented',context:'明确虚构，不写成采访。',evidence_ids:[]}];
 p.motifs=[{id:'lamp',name:'灯',description:'照亮等待，也可以照见离开后的空处。'},{id:'paper',name:'信纸',description:'反复出现的折痕，不以次数判断好坏。'}];
 p.fragments=[{id:'scene',title:'雨后的站台',text:'雨停后，灯还亮着。水沿着站牌慢慢落下来。',mode:'scene',observation_ids:['observed'],observations_sha256:observationsDigest(p,['observed']),motif_ids:['lamp'],intent:'从近处的雨声进入。'},{id:'memory-fragment',title:'纸上的折痕',text:'母亲写信的年份已经记不清了。我只记得，信纸总在同一处折起。',mode:'reflection',observation_ids:['memory'],observations_sha256:observationsDigest(p,['memory']),motif_ids:['paper'],intent:'保留记忆的不确定。'},{id:'departure',title:'留给没有来的人',text:'我把空座位留给一个从未来过的人，等天亮后再告别。',mode:'image',observation_ids:['invented'],observations_sha256:observationsDigest(p,['invented']),motif_ids:['lamp','paper'],intent:'明确虚构，将等待与告别并置。'}];
 const first=[{id:'opening',fragment_id:'scene',order:1},{id:'letter-position',fragment_id:'memory-fragment',order:2},{id:'ending',fragment_id:'departure',order:3},{id:'return',fragment_id:'scene',order:4}],second=[{id:'reverse-opening',fragment_id:'departure',order:1},{id:'reverse-middle',fragment_id:'memory-fragment',order:2},{id:'reverse-ending',fragment_id:'scene',order:3}];
 p.arrangements=[{id:'linear',title:'从雨声开始',items:first,fragments_sha256:arrangementDigest(p,first),rationale:'首尾同一片段独立出场，试读回声。'},{id:'reverse',title:'从告别开始',items:second,fragments_sha256:arrangementDigest(p,second),rationale:'先说告别，再回到仍亮着的灯。'}];
 p.variants=[{id:'variant',fragment_id:'scene',fragment_sha256:fragmentDigest(p.fragments[0]),text:'雨停了，站台的灯照着一小片空白。水仍沿着站牌落下来。',rationale:'把判断收回到可见的一小片空白，保留雨声。'}];
 p.notes=[{id:'note',target_kind:'arrangement',target_id:'linear',target_sha256:targetDigest(p,'arrangement','linear'),origin:'agent',comment:'比较首尾回声是否需要保留，不替作者选定。',status:'open',resolution:''}];return p;
}
export function temporary(p:any):any {return {evidence:{...p.evidence[0],id:'temp-evidence'},observation:{...p.observations[0],id:'temp-observation'},motif:{id:'temp-motif',name:'临时意象',description:''},fragment:{...p.fragments[0],id:'temp-fragment'},arrangement:{...p.arrangements[0],id:'temp-arrangement'},variant:{...p.variants[0],id:'temp-variant'},note:{...p.notes[0],id:'temp-note'}};}
