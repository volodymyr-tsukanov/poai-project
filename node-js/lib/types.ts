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
export type TUser = {
  id: number;
  alias: string;
  pass: string;
  type: "slave"|"master";
};
export type TSession = {
  id: string;
  userId: number;
  startedAt: number;
};

export type TLetter ={
  id: number;
  sender: string;
  email: string;
  gender: "ml"|"fl"|"tr";
  subject: "project-VT"|"pear"|"telephone-book"|"nspec";
  comment: string;
  status: "new"|"read"|"important"|"done";
  abd: string;
  sentAt: Date;
};