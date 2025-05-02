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
import { useState } from "react";


interface UFAuthProps {
  alias: string;
};

export default function UFAuth(props:UFAuthProps){
  const [pass, setPass] = useState('');

  const handleAuth = async ()=>{
    if(pass.length<4 || pass.length>30) alert("Id isn't fit");
    else{
      const response = await fetch('/api/cook',{
        method: "POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({typ:"sess",val:[props.alias,pass,"i"]})
      });
      if(!response.redirected){
        const body = await response.json();
        console.log(body);
        alert('Failed checking id. See console for dt.');
      }
    }
  };


  return (<div>
    <label htmlFor="pass">Pass it here {'->'}</label><input type="password" id="pass" placeholder="id" value={pass} onChange={(e)=>setPass(e.target.value)}></input>
    <input type="button" value="Auth" onClick={handleAuth} />
  </div>);
}