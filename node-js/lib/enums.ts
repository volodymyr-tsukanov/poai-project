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
export enum ELanguage {
  ENGLISH = "ENG",
  POLISH = "POL",
  UKRANIAN = "UKR"
};
export enum EServerResponse {
  Good = "g",
  FraudOuterValue = "fv",
  EmptyBody = "eb",
  NotEnoughParams = "np",
  WrongRequest = "wr",
  WrongContentType = "wt",
  WrongParam = "wp",
  ErrorGlobal = "eg",
  ErrorSpecific = "es"
};

export enum EGender {
  Male = "ml",
  Female = "fl",
  Other = "tr"
}
export enum EProject {
  Self = "project-VT",
  Pear = "pear",
  TelephoneBook = "telephone-book",
  NSpec = "nspec"
}
