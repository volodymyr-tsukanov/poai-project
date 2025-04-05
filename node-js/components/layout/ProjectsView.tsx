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
import style from "./ProjectsView.module.css";
import { ELanguage, EProject } from "@/lib/enums";
import { DEnum2Array } from "@/lib/consts";
import { FOrdinary } from "../ui/fonts";
import UTMarked from "../ui/text/UTMarked";
import UIExternal from "../ui/images/UIExternal";
import { useState } from "react";
import USImage from "../ui/skeletons/USImage";


interface ProjectsViewProps {
  language: ELanguage;
  projMap: Map<string,any>;
}

function Project({props}:{props:any}){
  return (
    <div className={style.project}>
      <UIExternal src={props.icon} alt={props.title} height={400} width={400} fallback={USImage({})} />
      <h2 className="antialiased">{props.title}</h2>
      <UTMarked text={props.text} className={style.projectBody} />
    </div>
  );
}

export default function ProjectsView(props:ProjectsViewProps){
  const [selectedImgView,setSelectedImgView] = useState<string|undefined>();

  const prjts = DEnum2Array(EProject);
  prjts.pop();  //removes nspec

  return (
    <div className={`${FOrdinary.className}`}>
      {prjts.map((project)=>(
        <Project key={project} props={props.projMap.get(project)} />
      ))}
    </div>
  );
}