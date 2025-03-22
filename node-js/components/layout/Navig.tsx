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
import style from './Navig.module.css';
import { TPageProps } from "@/lib/types";


export function Navig({lang}:TPageProps){
    return (
        <div className={style.navig}>
          {lang}
          <div id="navBtns">
            <button id="navBtnMain" className="btnNav">
              <div className="btnNavContent">
                <div className="lang-en">Main</div>
                <div className="lang-pl">Główna</div>
                <div className="lang-ua">Головна</div>
              </div>
            </button>
            <button id="navBtnPrjs" className="btnNav">
              <div className="btnNavContent">
                <div className="lang-en">Projects</div>
                <div className="lang-pl">Projekty</div>
                <div className="lang-ua">Проєкти</div>
              </div>
            </button>
            <button id="navBtnFoms" className="btnNav">
              <div className="btnNavContent">
                <div className="lang-en">Feedback</div>
                <div className="lang-pl">Opinia</div>
                <div className="lang-ua">Відгук</div>
              </div>
            </button>
            <button id="navBtnCots" className="btnNav">
              <div className="btnNavContent">
                <div className="lang-en">Contact</div>
                <div className="lang-pl">Kontakt</div>
                <div className="lang-ua">Контакт</div>
              </div>
            </button>
            <button id="navBtnSegs" className="btnNav">
              <div className="btnNavContent">
                <div className="lang-en">Settings</div>
                <div className="lang-pl">Ustawienia</div>
                <div className="lang-ua">Налаштування</div>
              </div>
            </button>
          </div>
          <div id={style.navigClosed}> VV/ -|- \VV </div>
        </div>
    );
}