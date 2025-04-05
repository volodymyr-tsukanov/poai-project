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
import { EGender, ELanguage, EProject } from "./enums";
import { CUID } from "./classes";


export interface IComponentProps {
  uid: CUID;
  language: ELanguage;
  props?: any;
};
export interface IFormProps {
  language: ELanguage;
  resMap: Map<string,string>;
  uToken?: string;
}

export interface IFeedbackLetter {
  sender: string;
  email: string;
  gender: EGender;
  subject: EProject;
  comment: string;
  errors?: any;
}
export interface IFeedbackLetterAction {
  type: "UPD_sender"|"UPD_email"|"UPD_comment"|"SET_gender"|"SET_subject"|"SET_errors"|"RST";
  payload: any;
}