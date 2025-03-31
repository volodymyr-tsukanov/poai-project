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
import { FSpecial } from "@/components/ui/fonts";
import UIExternal from "@/components/ui/images/UIExternal";
import USLoader from "@/components/ui/skeletons/USLoader";
import { CUID } from "@/lib/classes";


export default async function Home() {
  return (
    <div className={`${FSpecial.className} text-center`}>
      <a className="lnkA1" href="https://github.com/volodymyr-tsukanov" target="_blank">
        <UIExternal 
          src="https://img.shields.io/badge/GitHub-161A1D?style=social&logo=github&logoColor=black"
          height={50}
          alt="GitHub"
          className="height-max:50"
          fallback='Github' />
      </a> <br/>
      <a className="lnkA1" href="https://www.linkedin.com/in/volodymyr-tsukanov-4b624a299" target="_blank">
        <UIExternal
          src="https://img.shields.io/badge/Linkedin-161A1D?style=social&logo=linkedin&logoColor=black"
          height={50}
          alt="Linkedin"
          className="height-max:50" 
          fallback={USLoader({uid:new CUID('contact.l')})} />
      </a> <br/>
    </div>
  );
}
