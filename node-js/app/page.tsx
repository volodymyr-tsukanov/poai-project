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
import { FOrdinary } from "@/components/ui/fonts";
import { CLangs, CUID } from "@/lib/classes";
import { UTextConverger } from "@/lib/utils/TextConverger";
import React from "react";


export default function Home() {
  const TextConverger = new UTextConverger(new CUID('main'));
  const textA = CLangs.getByUID(new CUID('main.textA')) as string[];
  
  return (
    <div className={`${FOrdinary.className} text-center`}>
      {TextConverger.txtArray2html(textA,false,false,true)}
    </div>
  );
}
