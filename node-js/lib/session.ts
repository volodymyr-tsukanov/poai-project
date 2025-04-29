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
import { scryptSync, randomBytes, ScryptOptions, timingSafeEqual, randomUUID } from "crypto";


interface CryptoDuo {
  hash: string;
  salt: string;
}

export enum CryptoVersion {
  Awakening = 'a'
}; const VERSION_ACTUAL = CryptoVersion.Awakening;

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const BLOCK_SIZE = 8;
const COST = 16384; //CPU/mem
const PARALLEL = 1; //paralellization factor

class CryptoN {
  private static _instance:CryptoN;
  private version:CryptoVersion;
  private keyLength:number;
  private saltEncoding:BufferEncoding;
  private hashEncoding:BufferEncoding;
  private options:ScryptOptions;

  private constructor(version:CryptoVersion){
    this.version = version;
    switch(version){
      case VERSION_ACTUAL:
        this.keyLength = KEY_LENGTH;
        this.saltEncoding = 'hex';
        this.hashEncoding = 'base64';
        this.options = {
          cost: COST,
          blockSize: BLOCK_SIZE,
          parallelization: PARALLEL
        };
        break;
    }
  }
  public static GetInstance(version:CryptoVersion=VERSION_ACTUAL) : CryptoN{
    if(!CryptoN._instance){
      CryptoN._instance = new CryptoN(version);
    }
    return CryptoN._instance;
  }

  private static WrapUpHash(version:CryptoVersion,cd:CryptoDuo) : string{
    switch(version){
      case CryptoVersion.Awakening:
        return `${cd.hash}|${cd.salt}`;
    }
  }
  private static UnWrapHash(version:CryptoVersion,hashWrapped:string) : CryptoDuo|undefined{
    switch(version){
      case CryptoVersion.Awakening:
        const s = hashWrapped.split('|');
        if(s.length!==2) return undefined;
        return {hash:s[0],salt:s[1]};
    }
  }

  public protectSecret(secret:string) : string{
    const salt = randomBytes(SALT_LENGTH).toString(this.saltEncoding);
    const hashBuffer = scryptSync(secret,salt,this.keyLength,this.options);
    const hash = hashBuffer.toString(this.hashEncoding);
    return CryptoN.WrapUpHash(this.version,{hash:hash,salt:salt});
  }
  public verifySecret(secret:string,hashed:string) : boolean{
    const cd = CryptoN.UnWrapHash(this.version,hashed);
    if(cd===undefined) return false;
    const hashBuffer = scryptSync(secret,cd.salt,this.keyLength,this.options);
    const derivedKey = Buffer.from(cd.hash,this.hashEncoding);

    if(derivedKey.length===hashBuffer.length) return timingSafeEqual(hashBuffer,derivedKey);
    else return false;
  }
}
export const cryptonV = (version:CryptoVersion)=>CryptoN.GetInstance(version);
export const crypton = CryptoN.GetInstance();


interface Session {
  uId: number;
  startedT: number;
}

export const SESSION_KEY = "sess";
export const SESSION_DURATION = 7*60 * 60*1000;  //7h

class SessionStore {
  private static _instance:SessionStore;
  private sessions:Map<string,Session>;

  private constructor(){
    this.sessions = new Map<string,Session>();
  }
  public static GetInstance(){
    if(!SessionStore._instance){
      SessionStore._instance = new SessionStore();
    }
    return SessionStore._instance;
  }

  public startSession(userId:number) : string{
    const timestamp = Date.now();
    const sessionId = randomUUID();
    this.sessions.set(sessionId,{
      uId:userId,
      startedT:timestamp
    });
    return sessionId;
  }
  public getSession(sessionId:string) : Session|undefined{
    const timestamp = Date.now();
    const session = this.sessions.get(sessionId);
    if(session){
      if(timestamp-session.startedT > SESSION_DURATION){
        this.sessions.delete(sessionId);
      } else return session;
    }
  }
  public stopSession(sessionId:string){
    const session = this.sessions.get(sessionId);
    if(session){
      this.sessions.delete(sessionId);
    }
  }

  public get All(){
    return Array.from(this.sessions.entries()).map(([id,session])=>({
      id,
      userId:session.uId,
      startedT:new Date(session.startedT).toISOString()
    }));
  }
}
export const sessiont = SessionStore.GetInstance();