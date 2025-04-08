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
import { AGetLanguage, AGetUsers } from "@/app/actions";
import { CryptoN } from "@/lib/session";

interface User {
  id: number;
  alias: string;
  pass: string;
}

export default async function Home({params}:{params:Promise<{user:string}>}){
  const language = await AGetLanguage();
  const props = await params;
  const users = await AGetUsers() as User[];
  const crp = CryptoN.GetInstance();

  return (
    <div>
      Hello {props.user} <br/>
    </div>
  );
}
