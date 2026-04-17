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
import { TLetter, TSession, TUser } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EServerResponse } from "@/lib/enums";
import { ABoardChStatusLetter, ABoardDelLetter, ABoardDelSession } from "@/app/actions";


export interface UFBoardData {
  user: TUser,
  letters: TLetter[];
  sessions: TSession[];
}

export default function UFBoard(props:UFBoardData){
  const isMaster = props.user.type==='master';
  const router = useRouter();
  const [letters,setLetters] = useState<TLetter[]>(props.letters);
  const [sessions,setSessions] = useState<TSession[]>(props.sessions);
  const [error,setError] = useState<string|null>(null);

  const handleLogout = async()=>{
    setError(null);
    try{
      const response = await fetch('/api/sess',{
        method: "POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({typ:"sess",val:['-','-',"o"]})
      });
      if(response.ok){
        const responseBody = await response.json();
        if(responseBody.t==EServerResponse.Good) router.replace('/');
        else throw Error(`Logout: not good ${responseBody.t}`);
      }
    }catch(err){
      console.error("Logout error: ",err);
      setError('Logout error');
    }
  };
  const handleLetterDelete = async(letterId:number)=>{
    setError(null);
    try {
      const result = await ABoardDelLetter(letterId);
      if (result) {
        // Update state by filtering out the deleted letter
        setLetters(letters.filter(letter=>letter.id!==letterId));
        console.log(`Client: Letter ${letterId} deleted successfully`);
      } else {
        console.warn(`Client: Failed to delete letter ${letterId}`);
        setError(`Failed to delete letter ${letterId}`);
      }
    } catch(err){
      console.error(`Client: Error calling deleteLetterAction for ${letterId}:`, err);
      setError(`An error occurred while deleting letter ${letterId}.`);
    }
  };
  const handleSessionDelete = async(sessionId:string)=>{
    setError(null);
    try {
      const result = await ABoardDelSession(sessionId);
      if (result) {
        // Update state by filtering out the deleted session
        setSessions(sessions.filter(session=>session.id!==sessionId));
        console.log(`Client: Session ${sessionId} deleted successfully`);
      } else {
        console.warn(`Client: Failed to delete session ${sessionId}`);
        setError(`Failed to delete session ${sessionId}`);
      }
    } catch (err) {
      console.error(`Client: Error calling deleteSessionAction for ${sessionId}: `, err);
      setError(`An error occurred while deleting session ${sessionId}`);
    }
  };
  const handleLetterStatusChange = async(letterId:number,newStatus:TLetter['status'])=>{
    setError(null);
    // Optimistically update the UI state
    const originalLetters = letters; // Store original state in case of failure
    setLetters(letters.map(letter =>
      letter.id === letterId ? {...letter,status:newStatus}:letter
    ));
    try {
      const result = await ABoardChStatusLetter(letterId,newStatus);
      if (result) {
        console.log(`Client: Letter ${letterId} status updated to ${newStatus} successfully`);
      } else {
        console.warn(`Client: Failed to update letter ${letterId} status`);
        setError(`Failed to update status for letter ${letterId}`);
        // Revert state on failure
        setLetters(originalLetters);
      }
    } catch (err: any) {
        console.error(`Client: Error calling updateLetterStatusAction for ${letterId}: `, err);
        setError(`An error occurred while updating status for letter ${letterId}`);
        // Revert state on failure
        setLetters(originalLetters);
    }
  };

  const possibleStatuses: TLetter['status'][] = ["new","read","important","done"];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{marginBottom:'30px'}}>
        <h2>User Info</h2>
        <div>
          <b>Alias:</b> {props.user.alias} , 
          <b>Type:</b> {props.user.type} :
          <input type="button" value="LogOut" onClick={handleLogout} />
        </div>
      </div>

      <div style={{ marginBottom:'30px'}}>
        <h2>Letters ({letters.length})</h2>
        {letters.length === 0 ? (
          <p>No letters available.</p>
        ) : (
          <div style={{ maxWidth: '100%', maxHeight: '400px', overflow: 'auto', border: '1px solid #ccc' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Sender</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Gender</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Subject</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Comment</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>CreatedAt</th>
                {isMaster && <th style={{ padding: '8px', textAlign: 'left' }}>ABD</th>}
                <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {letters.map((letter) => (
                <tr key={letter.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{letter.id}</td>
                  <td style={{ padding: '8px' }}>{letter.sender}</td>
                  <td style={{ padding: '8px' }}>{letter.email}</td>
                  <td style={{ padding: '8px' }}>{letter.gender}</td>
                  <td style={{ padding: '8px' }}>{letter.subject}</td>
                  <td style={{ padding: '8px' }}>{letter.comment}</td>
                  <td style={{ padding: '8px' }}>
                    {/* Status Select/Dropdown */}
                    <select
                      value={letter.status}
                      onChange={(e) => handleLetterStatusChange(letter.id, e.target.value as TLetter['status'])}
                    >
                      {possibleStatuses.map(statusOption => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '8px' }}>{letter.sentAt.toLocaleString()}</td>
                  {isMaster && <td style={{ padding: '8px' }}>{letter.abd}</td>}
                  <td style={{ padding: '8px' }}>
                    <input type="button" value="Delete" onClick={() => handleLetterDelete(letter.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Sessions ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <p>No sessions available.</p>
        ) : (
          <div style={{ maxWidth: '100%', maxHeight: '250px', overflow: 'auto', border: '1px solid #ccc' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Started At</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{session.id}</td>
                  <td style={{ padding: '8px' }}>{session.userId}</td>
                  <td style={{ padding: '8px' }}>{new Date(session.startedAt).toUTCString()}</td>
                  <td style={{ padding: '8px' }}>
                    {session.userId===props.user.id ? '*SELF*' : <input type="button" value="Delete" onClick={() => handleSessionDelete(session.id)} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}