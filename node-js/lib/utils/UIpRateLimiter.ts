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
import { EServerResponse } from "@/lib/enums";
import { NextRequest, NextResponse } from "next/server";


interface IpRateLimit {
  count: number;
  penalty: number;
  startedT: number;
  lastT: number;
}

const REQUEST_FRAME_MS = 60*1000; //60s
const REQUEST_LIMIT = 13;
const REQUEST_LIMIT_PENALTY_MS = 8*1000;  //8s
const REQUEST_LIMIT_PENALTY_STEP = 3;

export class IpRateLimiter {
  private static _instance:IpRateLimiter;
  private ipRateLimits:Map<string,IpRateLimit>;

  private constructor(){
    this.ipRateLimits = new Map<string,IpRateLimit>();
  }
  public static GetInstance(){
    if(!IpRateLimiter._instance){
      IpRateLimiter._instance = new IpRateLimiter();
    }
    return IpRateLimiter._instance;
  }

  limitIpRate(request:NextRequest) : NextResponse|undefined{
    const responseBody = {sr:EServerResponse.TooMany,message:"Too many requests for poor tiny server"};
    const clientIp = request.headers.get('x-real-ip')??request.headers.get('x-forwarded-for')??request.referrer;  //?
    const record = this.ipRateLimits.get(clientIp);

    let limit = false;
    if(record){
      const timestamp = Date.now();
      const intervalMs = timestamp-record.startedT-record.penalty;
      if(intervalMs > REQUEST_FRAME_MS){
        record.count = 1;
        record.penalty = 0;
        record.startedT = timestamp;
        record.lastT = timestamp;
      } else {
        record.count++;
        if(record.count > REQUEST_LIMIT){
          limit = true;
          const penalty = Math.floor((record.count-REQUEST_LIMIT)/REQUEST_LIMIT_PENALTY_STEP);
          responseBody.message += ` count:${record.count} penalty:${penalty}`;
          record.penalty = penalty * REQUEST_LIMIT_PENALTY_MS;
        } 
        record.lastT = timestamp;
      }
      limit = record.count > REQUEST_LIMIT;
    } else {
      const timestamp = Date.now();
      this.ipRateLimits.set(clientIp,{
        count:1,
        penalty:0,
        startedT:timestamp,
        lastT:timestamp
      });
    }

    if(limit) return new NextResponse(JSON.stringify(responseBody), {status:429,headers:{'Content-Type':'application/json'}});
  }

  reset(){
    this.ipRateLimits.clear();
  }

  // DEBUG ONLY
  public get All(){
    return Array.from(this.ipRateLimits.entries()).map(([ip,entry])=>({
      ip,
      count: entry.count,
      penalty: entry.penalty,
      startedT: new Date(entry.startedT).toISOString(),
      lastT: new Date(entry.lastT).toISOString()
    }));
  }
}