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


const DB_PATH = path.join(process.cwd(),'data','data.db');

class DB {
  private static _instance:Database.Database;
  
  public static Get_instance() : Database.Database{
    if(!DB._instance){  //global init
      if(!fs.existsSync(DB_PATH)){
        fs.writeFileSync(DB_PATH,'');
      }
      DB._instance = new Database(DB_PATH);
      DB.initSchema();
    }
    return DB._instance;
  }

  private static initSchema(){  //TODO db init schema
    DB._instance.exec(`
      PRAGMA encoding = "UTF-8";
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias VARCHAR(10) NOT NULL UNIQUE,
        pass VARCHAR(128) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender VARCHAR(60) NOT NULL,
        email VARCHAR(254) NOT NULL,
        gender VARCHAR(2) NOT NULL CHECK(gender IN ('ml','fl','tr')) DEFAULT 'fl',
        subject VARCHAR(20) NOT NULL CHECK(subject IN ('project-VT','pear','telephone-book','nspec')) DEFAULT 'nspec',
        comment TEXT NOT NULL,
        sentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`);
  }
}
export const db = DB.Get_instance();