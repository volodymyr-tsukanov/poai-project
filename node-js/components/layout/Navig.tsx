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
import { CUID } from '@/lib/classes';
import UBNavig from '../ui/buttons/UBNavig';


export function Navig(){
  return (
    <div className={style.navig}>
      <div id={style.navigBtns}>
        <UBNavig uid={new CUID('navig.buttons.main')} props={{iconSrc:"/icons/info.png",iconAlt:"Main"}} />
        <UBNavig uid={new CUID('navig.buttons.projects')} props={{iconSrc:"/icons/portfolio.png",iconAlt:"Projects"}} />
        <UBNavig uid={new CUID('navig.buttons.feedback')} props={{iconSrc:"/icons/comment.png",iconAlt:"Comment"}} />
        <UBNavig uid={new CUID('navig.buttons.contact')} props={{iconSrc:"/icons/contacts.png",iconAlt:"Contacts"}} />
        <UBNavig uid={new CUID('navig.buttons.settings')} props={{iconSrc:"/icons/settings.png",iconAlt:"Settings"}} />
      </div>
      <div id={style.navigClosed}> VV/ -|- \VV </div>
      <button id={style.navigCBtn1}>
        Menu {/* TODO lang+uid */}
      </button>
    </div>
  );
}