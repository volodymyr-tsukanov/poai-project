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
'use client';
import { CLangs, CUID } from "@/lib/classes";
import { usePathname } from "next/navigation";


interface UTVariableProps {
  uidPart: string,
  className?: string,
  id?: string
}

export default function UTVariable(props:UTVariableProps){
  let pageName = usePathname().split("/")[1];
  if(pageName.length===0) pageName = 'main';
  const uid = new CUID(pageName+'.'+props.uidPart);
  const res = CLangs.getResByUID(uid);
  const text:string = (typeof res)==="string"?res:'VV/ -|- \VV';
  return (
    <p className={props.className} id={props.id}>{text}</p>
  );
}