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
import { CLanguage } from "@/lib/classes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";


/*export async function GET(req:Request) : Promise<NextResponse>{
  const urlSplitA = req.url.split('?');
  if(urlSplitA.length===2){
    const urlParams = new URLSearchParams(urlSplitA[1]);
    if(urlParams.has('typ')){
      const cookieStore = await cookies();
      switch(urlParams.get('typ')){
        case 'lang':
          return NextResponse.json({lang:cookieStore.get(CLangs.KEY)?.value});
        default:
          console.warn('yo, crook');
          return NextResponse.json({msg:'b'});
      }
    } else return NextResponse.json({msg:'a'});
  } else return NextResponse.json({msg:'n'});
}*/

export async function POST(req:Request) : Promise<NextResponse>{
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
        default:
          console.warn('yo, crook');
          return NextResponse.json({msg:'b'});
      }
    } else return NextResponse.json({msg:'a'});
  } else return NextResponse.json({msg:'n'});
}