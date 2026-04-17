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
import { DEnum2Array, DObject2Map } from "@/lib/consts";
import UTMarked from "../ui/text/UTMarked";
import UIExternal from "../ui/images/UIExternal";
import USImage from "../ui/skeletons/USImage";
import { FOrdinary } from "../ui/fonts";
import { Dispatch, SetStateAction, useState } from "react";
import PureSlider from "./PureSlider";


interface ProjectsViewProps {
  language: ELanguage;
  projMap: Map<string,any>;
}
interface ProjectProps {
  id: string;
  icon: string;
  title: string;
  text: string;
  badges?: any;
  OpenImageViewHandler?: Dispatch<SetStateAction<string|undefined>>;
}

function Project(props:ProjectProps){
  const badges = DObject2Map(props.badges);

  return (
    <div className={style.project}>
      <UIExternal src={props.icon} alt={props.title} height={400} width={400} fallback={USImage({})} className={style.projectIcon} OnClick={()=>{if(props.OpenImageViewHandler) props.OpenImageViewHandler(props.id)}}/>
      <h2 className="antialiased">{props.title}</h2>
      <div className={style.projectBody}>
        <UTMarked text={props.text} />
        {badges.size>1 && <h3>Badges</h3> /*TODO badges*/}
        {badges.size>0 && <div className={style.projectBadges}>{Array.from(badges.entries()).map((value,index)=>( //!unsafe shit
          <div key={`${props.title}-badge-${index}`}>{value[0]}</div>
        ))}</div>}
      </div>
    </div>
  );
}

export default function ProjectsView(props:ProjectsViewProps){
  const [selectedProject,setSelectedProject] = useState<string|undefined>();

  const prjts = DEnum2Array(EProject);
  prjts.pop();  //removes nspec

  return (
    <div className={`${FOrdinary.className}`}>
      {prjts.map((project)=>{
        if(selectedProject===project) return <PureSlider key={project} imgSrcs={props.projMap.get(selectedProject).galery as string[]} OnClose={()=>setSelectedProject(undefined)} />; //!unsafe typing
        else return <Project key={project} id={project} {...props.projMap.get(project)} OpenImageViewHandler={(props.projMap.get(project).galery)?setSelectedProject:undefined} />;
      })}
    </div>
  );
}