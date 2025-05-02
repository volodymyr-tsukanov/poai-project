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
import { EGender, EProject, EServerResponse } from "@/lib/enums";
import { IFormProps, IFeedbackLetter, IFeedbackLetterAction } from "@/lib/interfaces";
import { DEnum2Array, DRegexEmail, DRegexName } from "@/lib/consts";
import React, { useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export const LETTER_KEY = "letter";

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
    case "SET_errors":
      return {...state, errors:action.payload};
    case "RST":
      return letterInitState;
  }
}

async function requestLetterSend(letter:IFeedbackLetter,router:AppRouterInstance,resMap:Map<string,string>) {
  try{
    const abd = {UA:window.navigator.userAgent, app:{name:window.navigator.appName,platform:window.navigator.platform,productSub:window.navigator.productSub}, language:window.navigator.language, plugins:window.navigator.plugins, screen:{width:window.screen.width,height:window.screen.height,ratio:window.devicePixelRatio}};
    const response = await fetch('/api/letter',{
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({...letter,abd:abd})
    });
    const resBody = await response.json();
    if(resBody.t===EServerResponse.Good){
      alert(resMap.get('dialogs.formAccepted'));
      window.localStorage.removeItem(LETTER_KEY);
      router.refresh();
    } else{
      alert(resMap.get('dialogs.formRejected'));
      console.warn("Feedback::letter rejected: "+resBody.t);
    }
  } catch(e) {
    console.warn(e);
  }
}

function checkLeter({sender,email,gender,subject,comment}:IFeedbackLetter,resMap:Map<string,string>){
  const errors:any = {};

//TODO more error messages (currently using duplicates)
  /*Sender*/
  if(!sender){
    errors.sender = resMap.get('errors.sender.null');
  } else if(sender.length<4){
    errors.sender = resMap.get('errors.sender.length');
  } else if(sender.length>70){
    errors.sender = resMap.get('errors.sender.length');
  } else if(!DRegexName.test(sender)){
    errors.sender = resMap.get('errors.sender.regex');
  }
  /*Email*/
  if(!email){
    errors.email = resMap.get('errors.email.null');
  } else if(email.length<7){
    errors.email = resMap.get('errors.email.length');
  } else if(email.length>60){
    errors.email = resMap.get('errors.email.length');
  } else if(!DRegexEmail.test(email)){
    errors.email = resMap.get('errors.email.regex');
  }
  /*Gender*/
  if(!gender){
    errors.gender = resMap.get('errors.gender.null');
  }
  /*Subject*/
  if(!subject){
    errors.subject = resMap.get('errors.subject.null');
  }
  /*Comment*/
  if(!comment){
    errors.comment = resMap.get('errors.comment.null');
  } else if(comment.length<5){
    errors.comment = resMap.get('errors.comment.short');
  } else if(comment.length>9800){
    errors.comment = resMap.get('errors.comment.massive');
  } else if(comment.length>6000){
    errors.comment = resMap.get('errors.comment.huge');
  } else if(comment.length>2500){
    errors.comment = resMap.get('errors.comment.long');
  }

  if(Object.keys(errors).length>0) return errors;
  return null;
}
function saveLetter(letter:IFeedbackLetter){
  window.localStorage.setItem(LETTER_KEY,JSON.stringify(letter));
}

export default function UFFeedback(props:IFormProps){
  var initState:any = window.localStorage.getItem(LETTER_KEY);
  if(initState){
    initState = JSON.parse(initState) as IFeedbackLetter;
  } else {
    initState = letterInitState;
  }
  const router = useRouter();
  const [state,dispatch] = useReducer(reducer,initState);
  const stateRef = useRef(state);

  const handleSubmit = (ev:React.FormEvent)=>{
    ev.preventDefault();
    const errors = checkLeter(state,props.resMap);
    if(errors===null){
      dispatch({type:"RST",payload:null});
      //TODO lock form
      requestLetterSend(state,router,props.resMap);
    } else dispatch({type:"SET_errors",payload:errors});
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
    },776);
    return ()=>clearTimeout(tmoId);
  },[state]);

  const gnds = DEnum2Array(EGender);
  const prjts = DEnum2Array(EProject);

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <fieldset>
        <legend>{props.resMap.get('legend')}</legend>
        <label htmlFor="sender">{props.resMap.get("inputs.sender")}</label><input name="sender" id="sender" type="text" autoComplete="name" required value={state.sender} onChange={handleSenderhange} />
        <span id="error_sender" className="error">{state.errors && state.errors.sender}</span> <br/>

        <label htmlFor="email">{props.resMap.get("inputs.email")}</label><input name="email" id="email" type="email" autoComplete="email" required value={state.email} onChange={handleEmailChange} />
        <span id="error_email" className="error">{state.errors && state.errors.email}</span> <br/>

        <fieldset className="w-fit">
          <legend>{props.resMap.get("gender.legend")}</legend>
          {gnds.map((gender,index)=>(
            <div key={`g-${index}`} className="inline-block mr-4"><input key={`gI-${gender}`} type="radio" id={`g${gender}`} name="gender" value={gender} onChange={handleGenderChange} checked={state.gender==gender} /><label key={`gL-${gender}`} htmlFor={`g${gender}`} className="rdoA1">{props.resMap.get(`gender.inputs.${gender}`)}</label></div>
          ))}
          <span id="error_gender" className="error">{state.errors && state.errors.gender}</span>
        </fieldset>

        <label htmlFor="prjt">{props.resMap.get("subject.legend")}</label>:<select name="project" id="prjt" onChange={handleSubjectSelect}>
          {prjts.map((project)=>(
            <option key={`prjt-${project}`} value={project}>{props.resMap.get(`subject.options.${project}`)}</option>
          ))}
        </select> <span id="error_project" className="error">{state.errors && state.errors.subject}</span> <br/>
      
        <textarea name="comment" id="cmnt" value={state.comment} onChange={handleCommentChange} rows={7} placeholder={props.resMap.get("inputs.comment.placeholder")} title={props.resMap.get("inputs.comment.title")} required></textarea> <br/>
        <span id="error_comment" className="error">{state.errors && state.errors.comment}</span>
      </fieldset>

      <input hidden name="utoken" value={props.uToken} />

      <button type="submit" className="btnA1">{props.resMap.get('buttons.submit')}</button>
      <button type="reset" className="btnA1">{props.resMap.get('buttons.reset')}</button>
    </form>
  );
}