//    poai-project  Copyright  2025  volodymyr-tsukanov

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
import langs from '@/data/langs.json';
import { ELanguage } from "./enums";
import crypto from 'crypto';


export class CUID {
  private ok : boolean;
  private hash : string;
  private leafes : string[];

  constructor(uid:string,separator:string='.'){
    const leaves = uid.split(separator);
    this.leafes = [];
    this.ok = true;

    const hash16 = crypto.createHash('md5');
    let lPointer : any = langs.ENG;
    const it = leaves[Symbol.iterator]();
    while(this.ok){
      const itRes = it.next();
      if(itRes.done) break;
      if(itRes.value){
        if(itRes.value in lPointer){
          this.leafes.push(itRes.value);
          hash16.update(itRes.value);
          lPointer = lPointer[itRes.value];
        } else {
          this.ok = false;
        }
      }
    }
    this.hash = hash16.digest('base64');
  }

  public get complexity() : number{
    return this.leafes.length;
  }
  public get leaves() : readonly string[]{
    return this.leafes;
  }
  public get root() : string{
    return this.leafes[0];
  }
  public get lastLeaf() : string{
    return this.leafes[this.leafes.length-1];
  }
  public get isOk() : boolean{
    return this.ok;
  }
  public get hashCode() : string{
    return this.hash;
  }
}

export class CLanguage {
  public static KEY = 'lang';
  private lang:ELanguage;

  constructor(language:ELanguage){
    this.lang = language;
  }

  public get language() : ELanguage{
    return this.lang;
  }

  objHasNested(obj:any) : boolean{
    for(const key in obj){
      if(obj.hasOwnProperty(key)){
        if(obj[key] !== null && typeof obj[key]==='object'){
          return true;
        }
      }
    }
    return false;
  }
  mapNested(obj:any,parentKey='',result=new Map<string,string>()) : Map<string,string>{
    for(const key in obj){
      if(obj.hasOwnProperty(key)){
        const fullPath = parentKey?parentKey+'.'+key:key;
        if(obj[key] !== null && typeof obj[key]==='object'){  //obj has next
          this.mapNested(obj[key],fullPath,result);
        } else {  //obj is last
          result.set(fullPath,String(obj[key]));
        }
      }
    }
    return result;
  }

  /** Gets language resource
   * @returns (if exists) resource _string|string[]_
   * @returns (not found) _false_
   * @returns (not resouce) _true_
   */
  public getResByUID(uid:CUID) : string|string[]|boolean{
    if(!uid.isOk) return false;

    let lPointer : any = langs[this.lang];
    uid.leaves.forEach(leaf => {
      lPointer = lPointer[leaf];  //! any to string conflict
    });
    if(this.objHasNested(lPointer)) return true;
    return lPointer;
  }
  public getResMapByUID(uid:CUID) : Map<string,any>|boolean{
    if(!uid.isOk) return false;

    let lPointer : any = langs[this.lang];
    uid.leaves.forEach(leaf => {
      lPointer = lPointer[leaf];
    });
    if(lPointer){
      return this.mapNested(lPointer);
    } else return false;
  }

  public static StoL(languageString:string) : ELanguage{
    switch(languageString){
      case ELanguage.POLISH:
        return ELanguage.POLISH;
      case ELanguage.UKRANIAN:
        return ELanguage.UKRANIAN;
      default:
        return ELanguage.ENGLISH;
    }
  }
}