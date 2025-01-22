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
/* Default methods */
function setRadioIndex(name='', index=0){
	document.getElementsByName(name)[index].checked = true;
}
function getRadioIndex(name=''){
	let index = 0;
	let radio = document.getElementsByName(name);
	while(index < radio.length){
		if(radio[index].checked) break;
		index++;
	}
	return index;
}

function proccessSecret(secret){
	if(!secret) return ['noS', '-'];
	let sArr = secret.split(" ");
	if(sArr.length !== 2) sArr = ['noS', '-'];
	return sArr;
}


/* Form methods */
	/*Settings*/
function loadSettings(){
	let index = 0;
	switch(user.lang){
		case 'pl':
			index = 1;
			break;
		case 'ua':
			index = 2;
			break;
	}
	setRadioIndex('langs', index);
}
function saveSettings(){
	user.setPage(0);
	user.save();
	reloadPage();
}
function resetSettings(){
	user.setPage(0);
	user.resetPage();
	reloadPage();
}
function clearCache(){
	localStorage.removeItem('feedback');
	sessionStorage.clear();
	cachedData = { loader : '<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>' };
	showToast('Cache cleared!',4250);
}

	/*Feedback*/
function loadFeedbackFields(){
	let fields = localStorage.getItem('feedback');
	if(fields && confirm('Load last saved feedback data?')){
		fields = JSON.parse(fields);
		document.getElementById('name').value = fields.name;
		document.getElementById('sender').value = fields.sender;
		document.getElementById('prjt').value = fields.project;
		document.getElementById('cmnt').value = fields.comment;
		setRadioIndex('gender', fields.gender);
	} else console.log('no feedback data');
}
function saveFeedbackFields(){
	let fields = {};
	fields.name = document.getElementById('name').value;
	fields.sender = document.getElementById('sender').value;
	fields.project = document.getElementById('prjt').value;
	fields.comment = document.getElementById('cmnt').value;
	fields.gender = getRadioIndex('gender');
	localStorage.setItem('feedback', JSON.stringify(fields));
}
function clearFeedbackFields(){
	document.getElementById('name').value = '';
	document.getElementById('sender').value = '';
	document.getElementById('prjt').value = 'nspec';
	document.getElementById('cmnt').value = '';
	setRadioIndex('gender', 1);
	document.getElementById('error_name').innerHTML = '';
	document.getElementById('error_sender').innerHTML = '';
	document.getElementById('error_project').innerHTML = '';
	document.getElementById('error_comment').innerHTML = '';
}
function resetFeedbackFields(){
	if(confirm('Reset feedback?')){
		localStorage.removeItem('feedback');
		clearFeedbackFields();
	}
}
function giveFeedback(secret){
	let letter = new Letter();
	if(letter.gather()){
		let sArr = proccessSecret(secret);
		const requestData = {
			method: 'POST',
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify({
				'mail': letter.format(),
				[sArr[0]]: sArr[1]
			})
		};
		fetch(host+'forms',requestData).then(response => response.text()).then((data)=>{
			const mainBody = document.getElementById('mainBody');
			if(data == 'G'){	/*swap to secondBody*/
				const holder = mainBody.innerHTML;
				mainBody.innerHTML = cachedData.secondBody;
				cachedData.secondBody = holder;
				showToast('Letter sent!',2030);
			} else{
				console.warn('status: '+data);
				showToast('Feedback sent not properly. Refresh the page and try again',1918);
				reloadPage(false);
			}
		}).catch((e)=> console.error('sendFeedback: '+e));
	}
	return false;
}