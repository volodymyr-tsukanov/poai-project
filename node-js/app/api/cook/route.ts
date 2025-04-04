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
import { CLanguage } from "@/lib/classes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";


export async function POST(req:Request) : Promise<NextResponse>{
  try{
    if(req.headers.get('Content-Type')!=='application/json') return NextResponse.json({t:EServerResponse.WrongContentType});
    const reqBody = await req.json();
    if(reqBody){
      if(reqBody.typ && reqBody.val){
        const cookieStore = await cookies();
        switch(reqBody.typ){
          case 'lang':
            cookieStore.set(CLanguage.KEY,reqBody.val,{
              httpOnly: true,
              maxAge: (60*60*24)*30, //30 days
              path: '/'
            });
            revalidatePath('/','layout');
            return new NextResponse(null,{status:307}); //temp redirect
          default:  //<-- fraud
            return NextResponse.json({t:EServerResponse.FraudOuterValue});
        }
      } else return NextResponse.json({t:EServerResponse.NotEnoughParams});
    } else return NextResponse.json({t:EServerResponse.EmptyBody});
  } catch(_){
    return NextResponse.json({t:EServerResponse.ErrorGlobal});
  }
}