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


/* Default methods */
function proccessSecret(secret){
	if(!secret) return ['noS', '-'];
	let sArr = secret.split(" ");
	if(sArr.length !== 2) sArr = ['noS', '-'];
	return sArr;
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

	/*Control*/
function control(secret){

}