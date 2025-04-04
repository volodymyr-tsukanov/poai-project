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
import UFFeedback from "@/components/ui/forms/UFFeedback";
import { AGetLanguage } from "../actions";
import { notFound } from "next/navigation";


export default async function Home() {
  const lang = new CLanguage(await AGetLanguage());
  const resMap = lang.getResMapByUID(new CUID('feedback.form'));
  if(typeof resMap==="boolean"){
    console.error('Feedback::language map not found');
    notFound();
  }

  return (
    <div>
      <UFFeedback language={lang.language} resMap={resMap}/>
    </div>
  );
}
