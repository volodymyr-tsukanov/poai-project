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
import { NextRequest, NextResponse } from "next/server";


interface IpRateLimit {
  count: number;
  timer: NodeJS.Timeout;
}

const REQUEST_LIMIT_PM = 9;
const LIMIT_RESPONSE = {sr:EServerResponse.TooMany,message:"Too many requests for poor tiny server"};
const ipRateLimits = new Map<string,IpRateLimit>();

export function middleware(request:NextRequest){
  const clientIp = request.headers.get('x-real-ip')??request.headers.get('x-forwarded-for')??request.referrer;  //?
  if(!ipRateLimits.has(clientIp)){
    ipRateLimits.set(clientIp,{count:0,timer:setTimeout(()=>{ipRateLimits.delete(clientIp)},60*1000)});
  }

  const rl = ipRateLimits.get(clientIp)!;
  rl.count++;

  if(rl.count>REQUEST_LIMIT_PM){
    return new NextResponse(JSON.stringify(LIMIT_RESPONSE),{status:429,headers:{'Content-Type':'application/json'}});
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/u/:path*'
  ]
};