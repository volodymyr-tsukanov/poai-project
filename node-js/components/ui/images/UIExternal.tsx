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
import { DDelay, DIcon404 } from "@/lib/consts";
import { MouseEventHandler, ReactNode, Suspense } from "react";


interface UIExternalProps {
  src: string;
  height?: number;
  width?: number;
  alt: string;
  className?: string;
  fallback?: ReactNode;
  OnClick?: MouseEventHandler<HTMLImageElement>;
}

async function checkImage(src:string):Promise<boolean>{
  const ac = new AbortController();
  const tmoId = setTimeout(()=>ac.abort(),1000);  //1s timeout
  try{
    const res = await fetch(src,{method:'GET',cache:'force-cache',signal:ac.signal});
    clearTimeout(tmoId);
    return res.ok;
  } catch (e:any){
    if(e.name==='AbortError') console.warn('UIExternal::fetch timeout');
    else console.warn(e);
  }
  return false;
}

async function UIExternal(props:UIExternalProps){
  let src = props.src;
  const imgAvailable = await checkImage(props.src);
  if(!imgAvailable) src = DIcon404(96);

  return (
    <img
      src={src}
      width={props.width}
      height={props.height}
      className={props.className}
      alt={props.alt??"no-alt"}
      onClick={props.OnClick}
    />
  );
}
export default function UIExternalWrapper(props:UIExternalProps){
  if(props.fallback) return(<Suspense fallback={props.fallback}>{UIExternal(props)}</Suspense>);
  else return UIExternal(props);
}
