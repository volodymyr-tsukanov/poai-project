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
import { TLetter, TUser } from "@/lib/types";
import { ELanguage } from "@/lib/enums";
import { CLanguage } from "@/lib/classes";
import { SESSION_KEY, sessionCheck, sessionClose } from "@/lib/session";
import { db } from "@/lib/database";
import { UFBoardData } from "@/components/ui/forms/UFBoard";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";


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


// Board
async function authCheck() : Promise<TUser>{
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_KEY)?.value;
  if(sessionId===undefined){
    redirect('/',RedirectType.replace);
  }
  const session = sessionCheck(sessionId);
  if(session===undefined){
    cookieStore.delete(SESSION_KEY);
    redirect('/',RedirectType.replace);
  }
  const user = db.getUser(session.userId);
  if(user===undefined){
    //TODO harakiri
    cookieStore.delete(SESSION_KEY);
    sessionClose(sessionId);
    redirect('/ass',RedirectType.replace);
  }
  return user;
}
export async function ABoardGetData() : Promise<UFBoardData|undefined>{
  const user = await authCheck();
  if(user){
    const letters = db.letters??[];
    const sessions = db.sessions??[];
    if(user.type==="slave"){
      const placeholder = '🤫🫣🫥';
      user.pass = placeholder;
      letters.every((letter)=>letter.abd=placeholder);
    }
    return {
      user:user,
      letters:letters,
      sessions:sessions
    }
  }
}
// letters
export async function ABoardChStatusLetter(letterId:number,newStatus:"new"|"read"|"important"|"done") : Promise<boolean>{
  const user = await authCheck();
  if(user && letterId>=0){
    return db.updateLetterStatus(letterId,newStatus);
  }
  return false;
}
export async function ABoardDelLetter(letterId:number) : Promise<boolean>{
  const user = await authCheck();
  if(user && user.type==='master' && letterId>=0){
    return db.deleteLetter(letterId);
  }
  return false;
}

// sessions
export async function ABoardDelSession(sessionId:string) : Promise<boolean>{
  const user = await authCheck();
  if(user && sessionId.length>6){
    return db.deleteSession(sessionId);
  }
  return false;
}