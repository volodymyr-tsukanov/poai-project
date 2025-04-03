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
import { ELanguage } from "@/lib/enums";
import { CLanguage } from "@/lib/classes";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


interface UFSettingsProps {
  language: ELanguage,
  resMap: Map<string,string>
}

async function requestLanguageSave(language:ELanguage,router:AppRouterInstance) {
  try{
    const response = await fetch('/api/cook',{
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({typ:'lang',val:language})
    });
    if(response.status===307){
      console.log('Language changed!');
      router.refresh();
    }
  } catch(e) {
    console.warn(e);
  }
}
function cacheClear(){
  //TODO
}
function goBack(){
  window.history.back();
}

export default function UFSettings(props:UFSettingsProps){
  const router = useRouter();
  const [selectedLang,setSelectedLang] = useState(props.language);

  const handleSubmit = (ev:React.FormEvent)=>{
    ev.preventDefault();
    requestLanguageSave(selectedLang,router);
  }
  const handleReset = (ev:React.FormEvent)=>{
    const defaultLanguage = ELanguage.ENGLISH;
    requestLanguageSave(defaultLanguage,router);
    setSelectedLang(defaultLanguage);
  }
  const handleLangsChange = (ev:React.ChangeEvent<HTMLInputElement>)=>{
    const language:ELanguage = CLanguage.StoL(ev.target.value);
    setSelectedLang(language);
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <fieldset>
        <legend>{props.resMap.get('langs.legend')}</legend>
        <input className="rdoA1" type="radio" id="len" name="langs" value="ENG" onChange={handleLangsChange} checked={selectedLang===ELanguage.ENGLISH} /><label htmlFor="len" className="rdoA1"> English</label> <br />
        <input className="rdoA1" type="radio" id="lpl" name="langs" value="POL" onChange={handleLangsChange} checked={selectedLang===ELanguage.POLISH} /><label htmlFor="lpl" className="rdoA1"> Polski</label> <br />
        <input className="rdoA1" type="radio" id="lua" name="langs" value="UKR" onChange={handleLangsChange} checked={selectedLang===ELanguage.UKRANIAN} /><label htmlFor="lua" className="rdoA1"> Українська</label> <br />
        <span id="error_langs" className="error"></span>
      </fieldset>
      <fieldset>
        <legend>{props.resMap.get('cache.legend')}</legend>
        <button type="button" className="btnA1" onClick={cacheClear}>{props.resMap.get('cache.buttons.clear')}</button>
      </fieldset>
      <button type="submit" className="btnA1">{props.resMap.get('buttons.submit')}</button>
      <button type="reset" className="btnA1">{props.resMap.get('buttons.reset')}</button>
      <button type="button" className="btnA1" onClick={goBack}>{props.resMap.get('buttons.return')}</button>
    </form>
  );
}