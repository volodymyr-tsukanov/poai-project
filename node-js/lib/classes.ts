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
import langs from '@/data/props.json';
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

export class CLangs {
  public static readonly KEY = 'lang';
  private static currentLanguage:ELanguage = ELanguage.ENGLISH;

  public static get language():ELanguage{
    return this.currentLanguage;
  }

  public static getResByUID(uid:CUID) : string|string[]|boolean{
    if(!uid.isOk) return false;

    let lPointer : any = langs[CLangs.currentLanguage];
    uid.leaves.forEach(leaf => {
      lPointer = lPointer[leaf];  //! any to string conflict
    });
    return lPointer;
  }

  public static setLanguage(language:ELanguage){
    CLangs.currentLanguage = language;
  }
}