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
import style from './UBNavig.module.css';
import { TPageProps } from '@/lib/types';
import { CLangs } from '@/lib/classes';
import { DIconSide, DRandomInt } from '@/lib/consts';
import Image from 'next/image';


export default function UBNavig({uid,props}:TPageProps) {
  const text = CLangs.getByUID(uid);
  if(props === undefined){
    const c = DRandomInt(0,100);
    console.log(c);
    const icon = (c>98) ? 'butt-plug' : '404'
    props = {
      iconSrc: `/icons/${icon}.svg`,
      iconAlt: "non found"
    };
  }

  return (
    <button className={style.ubNavig}>
      <Image
        src={props.iconSrc}
        width={DIconSide}
        height={DIconSide}
        className={style.ubNavigIcon}
        alt={props.iconAlt??'no-alt'}
      />
      <div className={style.ubNavigContent}>
        {text}
      </div>
    </button>
  );
}
