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
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { TLetter, TSession, TUser } from "./types";


const DB_PATH = path.join(process.cwd(),'data','data.db');

class DB {
  private static _instance:DB;
  private dbInstance:Database.Database;

  private constructor(dbInstance:Database.Database){
    this.dbInstance = dbInstance;
  }
  public static GetInstance() : DB{
    if(!DB._instance){  //global init
      if(!fs.existsSync(DB_PATH)){
        fs.writeFileSync(DB_PATH,'');
      }
      const dbInstance = new Database(DB_PATH);
      DB.initScheme(dbInstance);
      DB._instance = new DB(dbInstance);
    }
    return DB._instance;
  }
  private static initScheme(dbInstance:Database.Database){  //TODO db init schema
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('encoding = "UTF-8"');
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias VARCHAR(10) NOT NULL UNIQUE,
        pass VARCHAR(128) NOT NULL,
        type VARCHAR(10) NOT NULL DEFAULT 'slave' CHECK(type IN ('slave','master'))
      );
      CREATE TABLE IF NOT EXISTS letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender VARCHAR(60) NOT NULL,
        email VARCHAR(254) NOT NULL,
        gender VARCHAR(2) NOT NULL DEFAULT 'fl' CHECK(gender IN ('ml','fl','tr')),
        subject VARCHAR(20) NOT NULL DEFAULT 'nspec' CHECK(subject IN ('project-VT','pear','telephone-book','nspec')),
        comment TEXT NOT NULL,
        sentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK(status IN ('new','read','important','done')),
        abd TEXT
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(64) PRIMARY KEY,
        userId INTEGER NOT NULL,
        startedAt INTEGER NOT NULL
      );`);
  }


  public getUser(uid:number) : TUser|undefined{
    return this.dbInstance.prepare('SELECT * FROM users WHERE id = ?').get(uid) as TUser|undefined;
  }
  public getUserByAlias(alias:string) : TUser|undefined{
    return this.dbInstance.prepare('SELECT * FROM users WHERE alias = ?').get(alias) as TUser|undefined;
  }

  public getSession(sessionId:string) : TSession|undefined{
    return this.dbInstance.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as TSession|undefined;
  }
  public get sessions() : TSession[]|undefined{
    return this.dbInstance.prepare('SELECT * FROM sessions').all() as TSession[]|undefined;
  }
  public insertSession(session:TSession) : boolean{
    return this.dbInstance.prepare('INSERT INTO sessions (id,userId,startedAt) VALUES (?,?,?)').run(session.id,session.userId,session.startedAt).changes>0;
  }
  public deleteSession(sessionId:string) : boolean{
    return this.dbInstance.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId).changes>0;
  }
  public deleteSessionsOfUser(userId:number) : number{
    return this.dbInstance.prepare('DELETE FROM sessions WHERE userId = ?').run(userId).changes;
  }
  public resetSessions(){
    this.dbInstance.prepare('DELETE FROM sessions').run();
  }

  public get letters() : TLetter[]|undefined{
    return this.dbInstance.prepare('SELECT * FROM letters').all() as TLetter[]|undefined;
  }
  public insertLetter(letter:TLetter) : boolean{
    return this.dbInstance.prepare(`INSERT INTO letters (status,sentAt,sender,email,gender,subject,comment,abd) VALUES ('new',CURRENT_TIMESTAMP,?,?,?,?,?,?)`).run(letter.sender,letter.email,letter.gender,letter.subject,letter.comment,letter.abd).changes>0;
  }
  public updateLetterStatus(letterId:number,newStatus:"new"|"read"|"important"|"done") : boolean{
    return this.dbInstance.prepare('UPDATE letters SET status = ? WHERE id = ?').run(newStatus,letterId).changes>0;
  }
  public deleteLetter(letterId:number) : boolean{
    return this.dbInstance.prepare('DELETE FROM letters WHERE id = ?').run(letterId).changes>0;
  }
}
export const db = DB.GetInstance();