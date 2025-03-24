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
import { CUID } from "../classes";
import { DRandomHash } from "../consts";
import React from "react";


enum TextMarkupStatus{
  None = ' ',
  Bold = 'b',
  Italic = 'i',
  BoldNItalic = 'j',
}

export class UTextConverger {
  private rKey : string;

  constructor(uid?:CUID){
    if(uid) this.rKey = uid.getHash();
    this.rKey = DRandomHash('md5');
  }

  /*private procBold(proc:(string|React.ReactNode)[]){
    let index:number = 0;
    proc = proc.map(part => {
      if(typeof part === 'string'){
        const bParts = part.split('**');
        if(bParts.length < 2) return part;
        const procElements:React.ReactNode[] = [bParts[0]];
        for(let i = 1; i < bParts.length; i+=2){
          procElements.push(React.createElement('b', {key:`${this.rKey}-b-${i}`}, bParts[i]));
          procElements.push(bParts[i+1]);
        }
        return React.createElement(React.Fragment, {key:`${this.rKey}-f-${index++}`}, ...procElements);
      } else return part;
    });
    console.warn(proc);
  }
  private procItalic(proc:(string|React.ReactNode)[]){
    let index:number = 0;
    proc = proc.map(part => {
      if(typeof part === 'string'){
        const iParts = part.split('_');
        if(iParts.length < 2) return part;
        const procElements:React.ReactNode[] = [iParts[0]];
        for(let i = 1; i < iParts.length; i+=2){
          procElements.push(React.createElement('i', {key:`${this.rKey}-i-${i}`}, iParts[i]));
          procElements.push(iParts[i+1]);
        }
        return React.createElement(React.Fragment, {key:`${this.rKey}-f-${index++}`}, ...procElements);
      } else return part;
    });
  }*/

  public md2html(input:string) : React.ReactNode{
    if(input.length<7) return null;
    let proc:React.ReactNode[] = [];

    const it:StringIterator<string> = input[Symbol.iterator]();
    let mkp:TextMarkupStatus = TextMarkupStatus.None;
    let buffer:string = '';
    let index:number = 0;
    let itRes = it.next();
    while(!itRes.done){
      if(mkp===TextMarkupStatus.None){
        if(itRes.value === '~'){
          itRes=it.next();  //look ahead to see markup type
          mkp = itRes.value as TextMarkupStatus;  //! unsafe char to enum
          proc.push(buffer); buffer='';
        } else buffer += itRes.value;
      } else{
        if(itRes.value === '~'){
          let elemType:string='a';
          switch(mkp){
            case TextMarkupStatus.Bold:
            case TextMarkupStatus.Italic:
              elemType=mkp;
              break;
            case TextMarkupStatus.BoldNItalic:
              break;
            default:
              console.warn(`TextConverger: no option '${mkp}'`);
              break;
          }
          proc.push(React.createElement(elemType,{key:`${this.rKey}-${elemType}-${index++}`},buffer));
          mkp=TextMarkupStatus.None; buffer='';
        } else buffer += itRes.value;
      }
      itRes = it.next();
    }

    if(buffer.length > 0) proc.push(buffer);
    return React.createElement(React.Fragment, null, ...proc);
  }

  /*public txtArray2html(input:string[],useBr:boolean=true,procMd2Html:boolean=false,procUnsafeTxtAsHtml:boolean=false) : React.ReactNode{
    if(input.length === 1) return React.createElement(React.Fragment,null,input[0]);
    const proc:React.ReactNode[] = [input[0]];
    for(let i = 1; i<input.length; i++){
      if(useBr) proc.push(React.createElement('br',{key:`${this.rKey}-br-${i}`}));
      if(procMd2Html) proc.push(this.md2html(input[i]));
      else if(procUnsafeTxtAsHtml) proc.push(React.createElement('div',{dangerouslySetInnerHTML:{__html:input[i]}}));
      else {
        if(useBr) proc.push(input[i]);
        else proc.push(React.createElement('div',{key:`${this.rKey}-div-${i}`},input[i]));
      }
    }
    return React.createElement(React.Fragment, null, ...proc);
  }*/
}