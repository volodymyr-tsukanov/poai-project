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
import { EGender, EProject } from "@/lib/enums";
import { IFormProps, IFeedbackLetter, IFeedbackLetterAction } from "@/lib/interfaces";
import { DEnum2Array } from "@/lib/consts";
import React, { ReactEventHandler, useEffect, useReducer, useRef } from "react";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export const LETTER_KEY = 'letter';

const letterInitState:IFeedbackLetter = {
  sender: "",
  email: "",
  gender: EGender.Female,
  subject: EProject.Self,
  comment: ""
}
const reducer = (state:IFeedbackLetter,action:IFeedbackLetterAction)=>{
  switch(action.type){
    case "UPD_sender":
      return {...state, sender:action.payload};
    case "UPD_email":
      return {...state, email:action.payload};
    case "UPD_comment":
      return {...state, comment:action.payload};
    case "SET_gender":
      return {...state, gender:action.payload};
    case "SET_subject":
      return {...state, subject:action.payload};
    case "RST":
      return letterInitState;
  }
}

async function requestLetterSend(letter:IFeedbackLetter,router:AppRouterInstance) {
  try{
    const response = await fetch('/api/letter',{
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(letter)
    });
    if(response.status===307){
      console.log('Letter sent!');
      router.refresh();
    }
  } catch(e) {
    console.warn(e);
  }
}
function saveLetter(letter:IFeedbackLetter){
  window.localStorage.setItem(LETTER_KEY,JSON.stringify(letter));
}

export default function UFFeedback(props:IFormProps){
  var initState:any = window.localStorage.getItem(LETTER_KEY);
  if(initState){
    initState = JSON.parse(initState) as IFeedbackLetter;
  }
  const router = useRouter();
  const [state,dispatch] = useReducer(reducer,initState);
  const stateRef = useRef(state);

  const handleSubmit = (ev:React.FormEvent)=>{
    ev.preventDefault();
    requestLetterSend(state,router);
  }
  const handleReset = (ev:React.FormEvent)=>{
    if(window.confirm(props.resMap.get('dialogs.confirmReset'))){
      window.localStorage.removeItem(LETTER_KEY);
      dispatch({type:"RST",payload:null});
    }
  }
  const handleSenderhange = (ev:React.ChangeEvent<HTMLInputElement>)=>{
    dispatch({type:"UPD_sender",payload:ev.target.value});
  }
  const handleEmailChange = (ev:React.ChangeEvent<HTMLInputElement>)=>{
    dispatch({type:"UPD_email",payload:ev.target.value});
  }
  const handleGenderChange = (ev:React.ChangeEvent<HTMLInputElement>)=>{
    dispatch({type:"SET_gender",payload:ev.target.value});
  }
  const handleSubjectSelect = (ev:React.ChangeEvent<HTMLSelectElement>)=>{
    dispatch({type:"SET_subject",payload:ev.target.value});
  }
  const handleCommentChange = (ev:React.ChangeEvent<HTMLTextAreaElement>)=>{
    dispatch({type:"UPD_comment",payload:ev.target.value});
  }

  useEffect(()=>{
    stateRef.current = state;
  },[state]);
  useEffect(()=>{
    const tmoId = setTimeout(()=>{
      if(stateRef.current) saveLetter(stateRef.current);
    },500);
    return ()=>clearTimeout(tmoId);
  },[state]);

  const gnds = DEnum2Array(EGender);
  const prjts = DEnum2Array(EProject);

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <fieldset>
        <legend>{props.resMap.get('legend')}</legend>
        <label htmlFor="sender">{props.resMap.get('inputs.sender')}</label><input name="sender" id="sender" type="text" autoComplete="name" required value={state.sender} onChange={handleSenderhange} />
        <span id="error_sender" className="error"></span> <br/>

        <label htmlFor="email">{props.resMap.get('inputs.email')}</label><input name="email" id="email" type="email" autoComplete="email" required value={state.email} onChange={handleEmailChange} />
        <span id="error_email" className="error"></span> <br/>

        <fieldset className="w:fit-content">
          <legend>{props.resMap.get('gender.legend')}</legend>
          {gnds.map((gender,index)=>(
            <div key={`g-${index}`} className="inline-block mr-4"><input key={`gI-${gender}`} type="radio" id={`g${gender}`} name="gender" value={gender} onChange={handleGenderChange} checked={state.gender==gender} /><label key={`gL-${gender}`} htmlFor={`g${gender}`} className="rdoA1">{props.resMap.get(`gender.inputs.${gender}`)}</label></div>
          ))}
        </fieldset>

        <label htmlFor="prjt">{props.resMap.get('subject.legend')}</label>:<select name="project" id="prjt" onChange={handleSubjectSelect}>
          {prjts.map((project)=>(
            <option key={`prjt-${project}`} value={project}>{props.resMap.get(`subject.options.${project}`)}</option>
          ))}
        </select> <span id="error_project" className="error"></span> <br/>
      
        <textarea name="comment" id="cmnt" value={state.comment} onChange={handleCommentChange} rows={7} placeholder={props.resMap.get('inputs.comment.placeholder')} title={props.resMap.get('inputs.comment.title')} required></textarea> <br/>
        <span id="error_comment" className="error"></span>
      </fieldset>

      <input hidden name="utoken" value={props.uToken} />

      <button type="submit" className="btnA1">{props.resMap.get('buttons.submit')}</button>
      <button type="reset" className="btnA1">{props.resMap.get('buttons.reset')}</button>
    </form>
  );
}