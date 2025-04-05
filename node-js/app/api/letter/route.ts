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
import { EGender, EProject, EServerResponse } from "@/lib/enums";
import { DEnum2Array, DRegexEmail, DRegexName } from "@/lib/consts";
import { NextResponse } from "next/server";


export async function POST(req:Request) : Promise<NextResponse>{
  try{
    if(req.headers.get('Content-Type')!=='application/json') return NextResponse.json({t:EServerResponse.WrongContentType});
    const reqBody = await req.json();
    if(reqBody){
      /*Sender*/
      if(!reqBody.sender){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"sender"});
      } else if(reqBody.sender.length<4||reqBody.sender.length>70){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"sender"});
      } else if(!DRegexName.test(reqBody.sender)){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"sender"});
      }
      /*Email*/
      if(!reqBody.email){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"email"});
      } else if(reqBody.email.length<7||reqBody.email.length>60){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"email"});
      } else if(!DRegexEmail.test(reqBody.email)){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"email"});
      }
      /*Gender*/
      if(!reqBody.gender){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"gender"});
      } else if(!DEnum2Array(EGender).includes(reqBody.gender)){  //<--- fraud
        return NextResponse.json({t:EServerResponse.FraudOuterValue});
      }
      /*Subject*/
      if(!reqBody.subject){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"subject"});
      } else if(!DEnum2Array(EProject).includes(reqBody.subject)){  //<-- fraud
        return NextResponse.json({t:EServerResponse.FraudOuterValue});
      }
      /*Comment*/
      if(!reqBody.comment){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"comment"});
      } else if(reqBody.comment.length<5||reqBody.comment.length>2500){
        return NextResponse.json({t:EServerResponse.WrongParam,p:"comment"});
      }
      /*ABD*/
      //TODO process abd
//TODO inser letter into db
      return NextResponse.json({t:EServerResponse.Good});
    } else return NextResponse.json({t:EServerResponse.EmptyBody});
  } catch(_){
    return NextResponse.json({t:EServerResponse.ErrorGlobal});
  }
}