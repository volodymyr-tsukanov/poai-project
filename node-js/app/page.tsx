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
import { CLanguage, CUID } from "@/lib/classes";
import { FOrdinary } from "@/components/ui/fonts";
import UTMarked from "@/components/ui/text/UTMarked";
import { ALanguageGet } from "./actions";
import React from "react";


export default async function Home() {
  const lang = new CLanguage(await ALanguageGet());
  const textAUID = new CUID('main.textA');
  const textA:string[] = lang.getResByUID(textAUID) as string[];

  return (
    <div className={`${FOrdinary.className} text-center`}>
      {
        textA.map((textPart,index)=>(
          <React.Fragment key={`${textAUID.hashCode}-f-${index}`}>
            <UTMarked text={textPart} />
          </React.Fragment>
        ))
      }
    </div>
  );
}
