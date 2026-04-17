/*
   poai-project  Copyright  2024  volodymyr-tsukanov

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const host = 'http://localhost/php/poai-project/php/pub/cpanel';	/*!default 'http://localhost/cpanel'*/
let user = new User();


document.addEventListener('DOMContentLoaded', ()=>{

});


/* Default methods */
function proccessSecret(secret){
	if(!secret) return ['noS', '-'];
	let sArr = secret.split(" ");
	if(sArr.length !== 2) sArr = ['noS', '-'];
	return sArr;
}

function addLetterListItem(jsonData,dItemName='status'){
	const letterListBody = document.getElementById('letterListBody');
	let item = document.createElement('tr');
	item.innerHTML = `<td>${jsonData[dItemName]}</td>
		<td>${jsonData.created}</td>
		<td>${jsonData.sender}</td>
		<td>${jsonData.receiver_id}</td>
		<td>
			<button type="button" onclick="viewLetter(${jsonData.id})">View</button>
			<button type="button" onclick="touchLetter(${jsonData.id},'answered')">MarkAsSolved</button>
		</td>`;
	letterListBody.appendChild(item);
}
function addNaughtyListItem(jsonData){
	const naughtyListBody = document.getElementById('naughtyListBody');
	let item = document.createElement('tr');
	item.innerHTML = `<td>${jsonData.ip_start}</td>
		<td>${jsonData.ip_end}</td>
		<td>${jsonData.reason}</td>
		<td>${jsonData.created}</td>
		<td>${jsonData.abd}</td>
		<td>
			<button type="button" onclick="removeNaughtyList(${jsonData.id})">Remove</button>
		</td>`;
	naughtyListBody.appendChild(item);
}


/* Form methods */
	/*SignUp*/
function clearSignupFields(){
	document.getElementById('sf_uname').value = '';
	document.getElementById('sf_pass').value = '';
	document.getElementById('error_uname').innerHTML = '';
	document.getElementById('error_pass').innerHTML = '';
}
function signUp(secret){
	if(user.gather()){
		let sArr = proccessSecret(secret);
		const requestData = {
			method: 'POST',
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify({
				'act': 'Lin',
				'user': user.format(),
				[sArr[0]]: sArr[1]
			})
		};
		fetch(host,requestData).then(response=>response.text()).then((data)=>{
			if(data == 'L'){
				location.reload();
			} else{
				console.warn('status: '+data);
				alert('SignUp went not properly. Refresh the page and try again');
			}
		}).catch((e)=>console.error('sendFeedback: '+e));
	}
	return false;
}
function logOut(){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'Lout',
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data == 'G'){
			sessionStorage.clear();
			location.reload();
		} else{
			console.warn('status: '+data);
			alert('LogOut went not properly. Refresh the page and try again');
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}

function gatherLettersBySubject(subject='project-VT'){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'GltrS',
			'subject': subject,
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data.length > 1){
			jsonData = JSON.parse(data);
			document.getElementById('letterListBody').innerHTML = '';
			document.getElementById('letterListDHeader').innerText = 'Status';
			jsonData.forEach(item=>{
				addLetterListItem(item);
			});
		} else if(data === 'X'){
			alert('No letters by this subject');
		} else{	/*TODO error responce handling */
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}
function gatherLettersByStatus(status='new'){	/*TODO merge with ^^^^^ upper*/
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'GltrT',
			'status': status,
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data.length > 1){
			jsonData = JSON.parse(data);
			document.getElementById('letterListBody').innerHTML = '';
			document.getElementById('letterListDHeader').innerText = 'Subject';
			jsonData.forEach(item=>{
				addLetterListItem(item,'subject');
			});
		} else if(data === 'X'){
			alert('No letters by this status');
		} else{	/*TODO error responce handling */
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}
function viewLetter(letterId){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'GltrI',
			'id': letterId,
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data.length > 1){
			jsonData = JSON.parse(data);
			document.getElementById('letterBody').style = '';
			document.getElementById('letterBodyText').innerHTML = `<b>Subject:</b> ${jsonData.subject}<br>
				<b>Sender:</b> ${jsonData.sender}<br>
				<b>Date:</b> ${jsonData.created}<br>
				<b>Status:</b> ${jsonData.status}<br>
				<b>Message:</b> ${jsonData.message}`;
			document.getElementById('letterList').style = 'display:none';
		} else{	/*TODO error responce handling*/
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}
function touchLetter(letterId, status='read'){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'UltrS',
			'id': letterId,
			'status': status,
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data == 'G'){
			gatherLettersBySubject();
		} else{	/*TODO error responce handling*/
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}

function gatherNaughty(){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'GnlS',
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data.length > 1){
			jsonData = JSON.parse(data);
			document.getElementById('naughtyListBody').innerHTML = '';
			jsonData.forEach(item=>{
				addNaughtyListItem(item);
			});
		} else if(data === 'X'){
			alert('NaugtyList is empty');
		} else{	/*TODO error responce handling */
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}
function removeNaughtyList(naugtyId){
	const uToken = document.getElementById('utoken').value;
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			'act': 'DnlI',
			'id': naugtyId,
			'utoken': uToken
		})
	};
	fetch(host,requestData).then(response => response.text()).then((data)=>{
		if(data == 'G'){
			gatherNaughty();	/*TODO local removal without new request*/
		} else{	/*TODO error responce handling*/
			console.warn('status: '+data);
		}
	}).catch((e)=>{
		console.error('logOut: '+e);
		alert('Logging out failed. Refresh the page.');
	});
}

	/*Control*/
function control(secret){

}