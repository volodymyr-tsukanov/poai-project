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
import { CLangs, CUID } from "@/lib/classes";
import { ELanguage } from '@/lib/enums';
import { Navig } from "@/components/layout/Navig";
import { Titler } from "@/components/layout/Titler";
import USLoader from '@/components/ui/skeletons/USLoader';
import { FSpecial, FSubtitleItalic } from "@/components/ui/fonts";
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { revalidatePath } from 'next/cache';


async function BodyLayout({children}:Readonly<{children:React.ReactNode;}>){
  try{  //LANGUAGE
    const cookieStore = await cookies();
    const lang = cookieStore.get(CLangs.KEY)?.value;
    if(lang){
      const language:ELanguage = lang as ELanguage; //!type unsafety
      CLangs.setLanguage(language);
    } else console.warn('empty language cookie');
  } catch(e){console.warn('language not loaded: '+e);}

  return (
    <div id="cntnr">
      <Titler />
      <Navig />
      <div id="mainBody">{children}</div>
      <footer className={`${FSubtitleItalic.className} antialiased`}> by VT 2025 </footer>
    </div>
  );
}

export default async function RootLayout({children}:Readonly<{children:React.ReactNode;}>) {
  return (
    <html lang="en">
      <head>
        <title> Project VT </title>
      </head>
      <body>
        <Suspense fallback={<div className={FSpecial.className}><USLoader uid={new CUID('main.l')} /></div>}>
          {BodyLayout({children})}
        </Suspense>
      </body>
    </html>
  );
}
