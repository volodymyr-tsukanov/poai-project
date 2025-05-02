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
'use server';
import { ELanguage } from "@/lib/enums";
import { CLanguage } from "@/lib/classes";
import { cookies } from "next/headers";
import { IFeedbackLetter } from "@/lib/interfaces";
import { revalidatePath } from "next/cache";


export async function ALanguageGet(defaultLanguage:ELanguage=ELanguage.ENGLISH) : Promise<ELanguage>{
  try{
    const lang = (await cookies()).get(CLanguage.KEY)?.value;
    if(lang){
      return CLanguage.StoL(lang);
    } else console.warn("empty language cookie");
  } catch(e){console.warn("language not loaded: "+e);}
  return defaultLanguage;
}
export async function ALanguageSet(language:ELanguage){
  (await cookies()).set(CLanguage.KEY,language,{
    httpOnly: true,
    maxAge: (60*60*24)*30, //30 days
    path: '/'
  });
  revalidatePath('/','layout');
}


export async function AGetLetters() : Promise<IFeedbackLetter[]>{
  return [];
}