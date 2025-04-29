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
import { sessiont, SESSION_KEY } from "@/lib/session";
import { IpRateLimiter } from "@/lib/utils/UIpRateLimiter";
import { NextRequest, NextResponse } from "next/server";


export function middleware(request:NextRequest){
  const pathName = request.nextUrl.pathname;
  const rateLimiter = IpRateLimiter.Get_instance();
  let res:NextResponse|undefined;

  res = rateLimiter.limitIpRate(request);
  if(res) return res;

  if(pathName.startsWith('/u/board')){
    const responseBlocked = new NextResponse(null,{status:403});
    const sessionId = request.cookies.get(SESSION_KEY)?.value;
    if(sessionId===undefined) return responseBlocked;
    const session = sessiont.getSession(sessionId);
    if(session===undefined) return responseBlocked;
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/u/:path*'
  ]
};