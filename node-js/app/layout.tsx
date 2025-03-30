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
import './globals.css';
import { CLangs } from "@/lib/classes";
import { ELanguage } from '@/lib/enums';
import { Navig } from "@/components/layout/Navig";
import { Titler } from "@/components/layout/Titler";
import { FSubtitleItalic } from "@/components/ui/fonts";
import { cookies } from 'next/headers';


async function loadCookies(){
  try{  //LANGUAGE
    const cookieStore = await cookies();
    const lang = cookieStore.get(CLangs.KEY)?.value;
    if(lang){
      CLangs.previewLanguage(lang as ELanguage);  //!type conflict string->ELanguage
    }
  } catch(e){console.warn('language not loaded: '+e);}
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  loadCookies();

  return (
    <html lang="en">
      <head>
        <title> Project VT </title>
      </head>
      <body>
        <div id="cntnr">
          <Titler />
          <Navig />
          <div id="mainBody">{children}</div>
          <footer className={`${FSubtitleItalic.className} antialiased`}> by VT 2025 </footer>
        </div>
      </body>
    </html>
  );
}
