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
import { CLangs, CUID } from "@/lib/classes";
import { ELanguage } from "@/lib/enums";
import { FOrdinary } from "@/components/ui/fonts";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";


async function requestLanguageSave(language:ELanguage,router:AppRouterInstance) {
  try{
    const response = await fetch('/api/cook',{
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({typ:'lang',val:language})
    });
    if(response.status===307||response.status===304){
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

export default function Home() {
  const router = useRouter();
  const [selectedLang,setSelectedLang] = useState(ELanguage.ENGLISH);

  const handleSubmit = (event:React.FormEvent)=>{
    event.preventDefault();
    requestLanguageSave(selectedLang,router);
  }
  const handleReset = (event:React.FormEvent)=>{
    event.preventDefault();
    requestLanguageSave(ELanguage.ENGLISH,router);
  }
  const handleLangsChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
    const lang:ELanguage = event.target.value as ELanguage; //!type conflict string->ELanguage
    setSelectedLang(lang);
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
    <fieldset>
        <legend>{CLangs.getResByUID(new CUID('settings.form.langs.legend'))}</legend>
        <input className="rdoA1" type="radio" id="len" name="langs" value="ENG" onChange={handleLangsChange} checked={selectedLang===ELanguage.ENGLISH} /><label htmlFor="len" className="rdoA1"> English</label> <br/>
        <input className="rdoA1" type="radio" id="lpl" name="langs" value="POL" onChange={handleLangsChange} checked={selectedLang===ELanguage.POLISH} /><label htmlFor="lpl" className="rdoA1"> Polski</label> <br/>
        <input className="rdoA1" type="radio" id="lua" name="langs" value="UKR" onChange={handleLangsChange} checked={selectedLang===ELanguage.UKRANIAN} /><label htmlFor="lua" className="rdoA1"> Українська</label> <br/>
        <span id="error_langs" className="error"></span>
    </fieldset>
    <fieldset>
        <legend>{CLangs.getResByUID(new CUID('settings.form.cache.legend'))}</legend>
        <button type="button" className="btnA1" onClick={cacheClear}>{CLangs.getResByUID(new CUID('settings.form.cache.buttons.clear'))}</button>
    </fieldset>
    
    <button type="submit" className="btnA1">{CLangs.getResByUID(new CUID('settings.form.buttons.submit'))}</button>
    <button type="reset" className="btnA1">{CLangs.getResByUID(new CUID('settings.form.buttons.reset'))}</button>
    <button type="button" className="btnA1" onClick={goBack}>{CLangs.getResByUID(new CUID('settings.form.buttons.return'))}</button>
</form>
  );
}
