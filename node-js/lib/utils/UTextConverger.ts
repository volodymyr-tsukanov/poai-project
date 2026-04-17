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
import { DRandomHash } from "../consts";
import { CUID } from "../classes";
import React, { HTMLAttributes, ReactNode } from "react";


enum TextMarkupStatus{
  None=" ",
  Bold="b",
  Italic="i",
  Underline="u",
  Strikeout="s",
  Manual="m"
}

export class UTextConverger {
  private rKey : string;

  constructor(uid?:CUID){
    if(uid) this.rKey = uid.hashCode;
    this.rKey = DRandomHash('md5');
  }

  public md2html(input:string,manualFormatting?:HTMLAttributes<ReactNode>[]) : ReactNode{
    if(input.length<7) return null;
    let proc:React.ReactNode[] = [];

    const it:StringIterator<string> = input[Symbol.iterator]();
    let mkp:TextMarkupStatus = TextMarkupStatus.None;
    let buffer:string = "";
    let index:number = 0;
    let itRes = it.next();
    while(!itRes.done){
      if(mkp===TextMarkupStatus.None){
        if(itRes.value==='~'){
          itRes=it.next();  //look ahead to see markup type
          mkp = itRes.value as TextMarkupStatus;  //! unsafe char to enum
          proc.push(buffer); buffer='';
        } else buffer += itRes.value;
      } else{
        if(itRes.value==='~'){
          let elemType:string='a';
          switch(mkp){
            case TextMarkupStatus.Bold:
            case TextMarkupStatus.Italic:
            case TextMarkupStatus.Underline:
            case TextMarkupStatus.Strikeout:
              elemType=mkp;
              break;
            case TextMarkupStatus.Manual:
              elemType='div';
              //TODO apply attributes to div
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
    return React.createElement(React.Fragment,null,...proc);
  }
}