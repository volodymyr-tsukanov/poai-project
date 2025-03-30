// Copyright - 2024 kennyotsu (kotsu)
// edited by volodymyr-tsukanov  2025

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import style from './USLoader.module.css';
import { TPageProps } from '@/lib/interfaces';
import { CLangs, CUID } from '@/lib/classes';
import React from 'react';


export default function USLoader({uid}:TPageProps){
  const text:string = CLangs.getResByUID(new CUID(uid.root+'.loading.text')) as string;
  const textA:string[] = CLangs.getResByUID(new CUID(uid.root+'.loading.textA')) as string[];

  return (
    <div className={style.loaderCard}>
      <div className={style.loader}>
        <span>{text}</span>
        <div className={style.loaderWords}>
        {
          textA.map((textPart,index)=>(
            <React.Fragment key={`${uid.hashCode}-f-${index}`}>
              <span className={style.loaderWord}>{textPart}</span>
            </React.Fragment>
          ))
        }
        </div>
      </div>
    </div>
  );
}
