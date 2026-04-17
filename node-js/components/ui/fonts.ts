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
import { Courier_Prime } from "next/font/google";
import { Faculty_Glyphic } from "next/font/google";
import { Lekton } from "next/font/google";
import { Sixtyfour_Convergence } from "next/font/google";


export const FTitle = Faculty_Glyphic({
  weight: "400",
  preload: true
});
export const FSubtitle = Courier_Prime({
  weight: "700",
  preload: true,
  fallback: ["Courier New","Courier","monospace"]
});
export const FSubtitleSlim = Courier_Prime({
  weight: "400",
  preload: true,
  fallback: ["Courier New","Courier","monospace"]
});
export const FSubtitleItalic = Courier_Prime({
  weight: "400",
  style: "italic",
  preload: true,
  fallback: ["Courier New","Courier","monospace"]
});

export const FOrdinary = Lekton({
  weight: "400"
});

export const FSpecial = Sixtyfour_Convergence({
  weight: "400",
  preload: false
});
