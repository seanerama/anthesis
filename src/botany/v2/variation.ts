import { createHash } from "node:crypto";

export type VariationRange={min:number;max:number;distribution:"uniform"|"triangular";concern:string;class:"structural"|"decorative"};

const rotl=(x:number,k:number)=>((x<<k)|(x>>>(32-k)))>>>0;
export class Xoshiro128ss{
  constructor(private s:[number,number,number,number]){if(s.every(x=>x===0))this.s[0]=1;}
  nextUint32():number{const r=(rotl(Math.imul(this.s[1],5)>>>0,7)*9)>>>0,t=(this.s[1]<<9)>>>0;this.s[2]^=this.s[0];this.s[3]^=this.s[1];this.s[1]^=this.s[2];this.s[0]^=this.s[3];this.s[2]^=t;this.s[3]=rotl(this.s[3],11);return r;}
  next():number{return this.nextUint32()/0x100000000;}
}
export function namedStream(seed:string,featureId:string,concern:string):Xoshiro128ss{const b=createHash("sha256").update(`${seed}\0${featureId}\0${concern}\0xoshiro128ss-v1`).digest();return new Xoshiro128ss([b.readUInt32LE(0),b.readUInt32LE(4),b.readUInt32LE(8),b.readUInt32LE(12)]);}
export function sampleVariation(seed:string,id:string,r:VariationRange):number{const p=namedStream(seed,id,r.concern),u=r.distribution==="triangular"?(p.next()+p.next())/2:p.next();return r.min+(r.max-r.min)*u;}
