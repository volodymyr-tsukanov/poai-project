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
import { EServerResponse } from "@/lib/enums";
import { DIsArrayOf, DIsRelease } from "@/lib/consts";
import { crypton, sessionStart, sessionClose, SESSION_KEY, SESSION_DURATION } from "@/lib/session";
import { db } from "@/lib/database";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


function statusResponse(status:EServerResponse,message?:String) : NextResponse{
  return NextResponse.json({t:status,m:message});
}

export async function POST(req:Request){
  try{
    if(req.headers.get('Content-Type')!=='application/json') return NextResponse.json({t:EServerResponse.WrongContentType});
    const reqBody = await req.json();
    if(reqBody){
      if(reqBody.typ && reqBody.val){
        const cookieStore = await cookies();
        switch(reqBody.typ){
          case SESSION_KEY:        //.val is string[alias,pass,action("i"|"o")]
          if(!(DIsArrayOf(reqBody.val,'string'))) return statusResponse(EServerResponse.WrongContentType);
          const arr = reqBody.val as string[];
          if(arr.length!==3 || arr[2].length!==1) return statusResponse(EServerResponse.NotEnoughParams);
          switch(arr[2]){
            case "i": //in
              if(arr[0].length<2 || arr[1].length<4) return statusResponse(EServerResponse.NotEnoughParams);
              const user = db.getUserByAlias(arr[0]);
              if(user){
                if(crypton.verifySecret(arr[1],user.pass)){
                  cookieStore.delete(SESSION_KEY);
                  const sessionId = sessionStart(user.id);
                  if(sessionId===undefined) return statusResponse(EServerResponse.ErrorSpecific);
                  cookieStore.set(SESSION_KEY,sessionId,{
                    httpOnly: true,
                    secure: DIsRelease(),
                    maxAge: SESSION_DURATION / 60,
                    path: '/'
                  });
                  return new NextResponse(null,{status:307}); //temp redirect
                } else return statusResponse(EServerResponse.FraudOuterValue);
              }
              break;
            case "o": //out
              const sessionId = cookieStore.get(SESSION_KEY)?.value;
              cookieStore.delete(SESSION_KEY);
              if(sessionId){
                sessionClose(sessionId);
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