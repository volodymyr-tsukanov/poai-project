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
/* Classes */
class Settings {
	constructor(){
		let s = JSON.parse(localStorage.getItem('settings'));
		if(s == null || s == undefined) this.reset();
		else{
			this.lang = s.lang;
			this.lastPage = s.lastPage;
		}
	}

	preview(){
		const sl = document.getElementsByName('langs');
		for(let i = 0; i < sl.length; i++){
			if(sl[i].checked){
				this.lang = sl[i].value;
				break;
			}
		}
		this.applyLanguage();
	}
	update(){
		this.lastPage = 0;
		const sl = document.getElementsByName('langs');
		for(let i = 0; i < sl.length; i++){
			if(sl[i].checked){
				this.lang = sl[i].value;
				break;
			}
		}
		this.save();
	}
	set(pageId, lang){
		if(pageId != undefined) this.lastPage = pageId;
		if(lang != undefined) this.lang = lang;
		this.save();
	}
	reset(){
		this.lastPage = -1; /*load settings page by default*/
		this.lang = 'en';
		this.save();
	}

	applyLanguage(){
		/* langs.css */
		const styleshit = document.styleSheets[1];	/*langs.css must be secont <style>*/
		const ruleIndex = 3;
		
		styleshit.deleteRule(3);
		/*console.log('before: ', styleshit);*/

		switch(this.lang){
			case "pl":
				styleshit.insertRule('.lang-pl{display:inline-block;}', 3);
				break;
			case "ua":
				styleshit.insertRule('.lang-ua{display:inline-block;}', 3);
				break;
			default:
				styleshit.insertRule('.lang-en{display:inline-block;}', 3);
				break;
		}
	}

	save(){
		const jsonData = { lang : this.lang, lastPage : this.lastPage };
		localStorage.setItem('settings', JSON.stringify(jsonData));
	}
}


/* Main */
	/* Preload */
const host = 'http://localhost/php/poai-project/php/pub/';	/*!default 'http://localhost/'*/
const loadingHTML = '<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>';

if(window.location.href != host) window.location.replace(host);	/*jump to init*/
var settings = new Settings();


document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('cntnr');

	/* Awake */
	loadPage(settings.lastPage, settings.lang);
});


function loadPage(pageId, lang){
	const nav = document.querySelector('nav');
	const mainBody = document.getElementById('mainBody');

	if(lang == undefined) lang = settings.lang;
	settings.applyLanguage();

	mainBody.innerHTML = loadingHTML;
	const requestData = {
		method: 'UPDATE',
		headers: {
			'Content-Type': "application/json",
			'Authorization': "Bearer token"
		}
	};

	switch(pageId){
		case -1: /* settings */
			fetch(host+'settings',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
				document.getElementById('error_langs').innerHTML = '<div class="lang-en">Current language is</div><div class="lang-pl">Język</div><div class="lang-ua">Мова</div>: ' + settings.lang;
				nav.style.display = 'none';
				loadSettings();
			}).catch((e) => console.error('fetchPage: '+e));
			break;
		case 0: /*main*/
			fetch(host+'main',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
			}).catch((e) => console.error('fetchPage: '+e));;
			break;
		case 1: /*projects*/
			fetch(host+'projects',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
			}).catch((e) => console.error('fetchPage: '+e));;
			break;
		case 2: /*forms*/
			fetch(host+'forms',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
				loadFields();
			}).catch((e) => console.error('fetchPage: '+e));;
			break;
		case 3: /*contacts*/
			fetch(host+'contacts',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
			}).catch((e) => console.error('fetchPage: '+e));;
			break;
		default:
			break;
	}

	if(pageId >= 0) settings.set(pageId);
}

function updatePage(jsonData){
	document.querySelector('header').innerHTML = jsonData.content.header;
	document.getElementById('mainBody').innerHTML = jsonData.content.mainBody;
	document.title = jsonData.content.title;
}


async function reloadCSS(){
	const lnks = document.getElementsByTagName('link');
	for(let i = 0; i < lnks.length; i++){
		if (lnks[i].rel === "stylesheet"){
			var href = lnks[i].href.split("?")[0];
			lnks[i].href = href + "?rnd=" + new Date().getMilliseconds();
		}
	}
	await new Promise(wt => setTimeout(wt, 2500));
}
