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
import { ELanguage, EServerResponse } from "@/lib/enums";
import { IUser } from "@/lib/interfaces";
import { DIsArrayOf, DIsRelease } from "@/lib/consts";
import { CLanguage } from "@/lib/classes";
import { db } from "@/lib/database";
import { crypton, sessiont, SESSION_DURATION, SESSION_KEY } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";


function statusResponse(status:EServerResponse,message?:String) : NextResponse{
  return NextResponse.json({t:status,m:message});
}

export async function POST(req:Request) : Promise<NextResponse>{
  try{
    if(req.headers.get('Content-Type')!=='application/json') return NextResponse.json({t:EServerResponse.WrongContentType});
    const reqBody = await req.json();
    if(reqBody){
      if(reqBody.typ && reqBody.val){
        const cookieStore = await cookies();
        switch(reqBody.typ){
          case "lang":
            //TODO chech .val is ELanguage
            cookieStore.set(CLanguage.KEY,reqBody.val,{
              httpOnly: true,
              maxAge: (60*60*24)*30, //30 days
              path: '/'
            });
            revalidatePath('/','layout');
            return new NextResponse(null,{status:307}); //temp redirect
          case SESSION_KEY:        //.val is string[alias,pass,action("i"|"o")]
            if(!(DIsArrayOf(reqBody.val,'string'))) return statusResponse(EServerResponse.WrongContentType);
            const arr = reqBody.val as string[];
            if(arr.length!==3 || arr[0].length<2 || arr[1].length<4 || arr[2].length!==1) return statusResponse(EServerResponse.NotEnoughParams);
            switch(arr[2]){
              case "i": //in
                const user = db.prepare('SELECT * FROM users WHERE alias = ?').get([arr[0]]) as IUser|undefined;
                if(user){
                  if(crypton.verifySecret(arr[1],user.pass)){
                    cookieStore.delete(SESSION_KEY);
                    const sessionId = sessiont.startSession(user.id);
                    cookieStore.set(SESSION_KEY,sessionId,{
                      httpOnly: true,
                      sameSite: 'lax',
                      secure: DIsRelease(),
                      maxAge: SESSION_DURATION / 60,
                      path: '/u'
                    });
                    revalidatePath('/u');
                    return new NextResponse(null,{status:307}); //temp redirect
                  } else return statusResponse(EServerResponse.FraudOuterValue);
                }
                break;
              case "o": //out
                const sessionId = cookieStore.get(SESSION_KEY)?.value;
                if(sessionId){
                  sessiont.stopSession(sessionId);
                  cookieStore.delete(SESSION_KEY);
                }
                break;
            }
            return statusResponse(EServerResponse.WrongParam);
          default:  //<-- fraud
            return statusResponse(EServerResponse.FraudOuterValue);
        }
      } else return statusResponse(EServerResponse.NotEnoughParams);
    } else return statusResponse(EServerResponse.EmptyBody);
  } catch(e){
    const err = e as Error;
    return statusResponse(EServerResponse.ErrorGlobal,`${err.name}::${err.message} in ${err.stack}`);
  }
}