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
'use client';
import { DIcon404 } from "@/lib/consts";
import { MouseEventHandler, ReactNode, useState, useEffect } from "react";


interface UIExternalProps {
  src: string;
  height?: number;
  width?: number;
  alt: string;
  className?: string;
  timeout?: number;
  fallback?: ReactNode;
  OnClick?: MouseEventHandler<HTMLImageElement>;
}

export default function UIExternal(props:UIExternalProps){
  const [isLoading,setIsLoading] = useState(true);
  const [hasError,setHasError] = useState(false);

  useEffect(()=>{
    const img = new window.Image();
    img.src = props.src;

    const tmoId = setTimeout(()=>handleError,props.timeout??2000);
    const handleLoad = ()=>{
      clearTimeout(tmoId);
      setIsLoading(false);
      setHasError(false);
    };
    const handleError = ()=>{
      clearTimeout(tmoId);
      setIsLoading(false);
      setHasError(true);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.onabort = handleError;

    return ()=>{
      img.onload = null;
      img.onerror = null;
      img.onabort = null;
      clearTimeout(tmoId);
    }
  },[props.src])

  if(hasError) return <img
    src={DIcon404(96)}
    width={props.width}
    height={props.height}
    className={props.className}
    alt={props.alt??"no-alt"}
    loading='lazy'
    onClick={props.OnClick}
  />;
  else{
    if(isLoading&&props.fallback) return <>{props.fallback}</>;
    else return <img
        src={props.src}
        width={props.width}
        height={props.height}
        className={props.className}
        alt={props.alt??"no-alt"}
        loading='lazy'
        onClick={props.OnClick}
      />;
  }
}
