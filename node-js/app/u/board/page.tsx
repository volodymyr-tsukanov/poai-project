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
import { SESSION_KEY, sessionCheck } from "@/lib/session";
import UFBoard from "@/components/ui/forms/UFBoard";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";


export default async function Page(){
  let isOk = true;
  const cok = await cookies();
  const sessionId = cok.get(SESSION_KEY)?.value;
  if(sessionId===undefined){
    isOk = false;
    redirect('/',RedirectType.replace);
  }
  const session = sessionCheck(sessionId);
  if(session===undefined){
    isOk = false;
    redirect('/',RedirectType.replace);
  }

  return isOk ? (
    <div>
      Welcome to ProjectVT Board <br/>
      <UFBoard userId={session.userId}/>
    </div>
  ) : 'NO WAY';
}
