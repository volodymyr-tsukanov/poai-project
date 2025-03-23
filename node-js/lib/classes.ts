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


export class CUID {
  private ok : boolean;
  private leafes : string[];

  constructor(uid:string,separator:string='.'){
    const leaves = uid.split(separator);
    this.leafes = [];
    this.ok = true;

    let lPointer : any = langs.ENG;
    const it = leaves[Symbol.iterator]();
    while(this.ok){
      const itRes = it.next();
      if(itRes.done) break;
      if(itRes.value){
        if(itRes.value in lPointer){
          this.leafes.push(itRes.value);
          lPointer = lPointer[itRes.value];
        } else {
          this.ok = false;
        }
      }
    }
  }

  public isOk() : boolean{
    return this.ok;
  }
  public length() : number{
    return this.leafes.length;
  }
  public get getLeaves() : readonly string[]{
    return this.leafes;
  }
}

export class CLangs {
  public static readonly localStorageKey = 'lang';
  private static currentLanguage : ELanguage = ELanguage.ENGLISH;

  public static getByUID(uid:CUID) : string|boolean{
    if(!uid.isOk()) return false;

    let lPointer : any = langs[CLangs.currentLanguage];
    uid.getLeaves.forEach(leaf => {
      lPointer = lPointer[leaf];  //! any to string conflict
    });
    return lPointer;
  }

  /** Loads language from `localStorage` */
  public static loadLanguage(){
    const storedLanguage = localStorage.getItem(this.localStorageKey);
    if (storedLanguage && Object.values(ELanguage).includes(storedLanguage as ELanguage)) {
      this.currentLanguage = storedLanguage as ELanguage;
    } else this.currentLanguage = ELanguage.ENGLISH;
  }

  /** Changes global language settings, @returns false if already set */
  public static switchLanguage(newLanguage:ELanguage):boolean{
    if(CLangs.currentLanguage === newLanguage) return false;
    else{
      CLangs.currentLanguage = newLanguage;
      localStorage.setItem(this.localStorageKey,newLanguage);
      return true;
    }
  }
}