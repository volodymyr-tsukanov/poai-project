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
import style from "./USImage.module.css";


interface USImageProps {
  height?: number;
  width?: number;
  className?: string;
}

export default function USImage(props:USImageProps){
  const height = props.height??100, width = props.width??100;

  return (
    <div className={`${style.block} ${props.className}`} style={{height:height,width:width}}>
    </div>
  );
}