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
import { IpRateLimiter } from "@/lib/utils/UIpRateLimiter";
import { NextRequest, NextResponse } from "next/server";


export function middleware(request:NextRequest) {
  const pathName = request.nextUrl.pathname;
  const rateLimiter = IpRateLimiter.GetInstance();
  let res:NextResponse|undefined;

  res = rateLimiter.limitIpRate(request);
  console.log(rateLimiter.All);
  if(res) return res;

  if(pathName.startsWith('/u/board')){
    const sessionId = request.cookies.get("sess")?.value;
    if(sessionId===undefined) return new NextResponse(null,{status:403,statusText:'no cookie'});
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/u/:path*'
  ]
};