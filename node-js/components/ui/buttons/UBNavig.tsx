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
import { IComponentProps } from '@/lib/interfaces';
import { CLanguage } from '@/lib/classes';
import { DIcon404, DIconSide } from '@/lib/consts';
import { FSubtitle } from '../fonts';
import Image from 'next/image';
import Link from 'next/link';


export default function UBNavig({uid,lang,props}:IComponentProps) {
  const langu = new CLanguage(lang);
  const text = langu.getResByUID(uid);
  if(props === undefined){
    props = {
      iconSrc: DIcon404,
      iconAlt: "non found"
    };
  }
  let target = uid.lastLeaf;
  if(target=='main') target='/';

  return (
    <Link key={`${uid.hashCode}-l`} href={target} className={style.ubNavig} prefetch={props.prefetch??null}>
      <Image
        src={props.iconSrc}
        width={DIconSide}
        height={DIconSide}
        className={style.ubNavigIcon}
        alt={props.iconAlt??'no-alt'}
      />
      <p className={`${style.ubNavigContent} ${FSubtitle.className}`}>
        {text}
      </p>
    </Link>
  );
}
