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
	/*Init*/
const host = 'http://localhost/php/poai-project/php/pub/';	/*!default 'http://localhost/'*/

if(window.location.href != host) window.location.replace(host);	/*jump to init*/
let settings = new Settings();
let cachedData = { loading : '<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>', secondBody : '' };

	/*Preload*/
/*loadResources();*/


document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('cntnr');
	const navCBtn1 = document.getElementById('navCBtn1');

	/* Awake */
		/*Events - Navigation*/
	navCBtn1.addEventListener('click', ()=> {
		const btns = document.getElementById('navBtns');
		if(btns.checkVisibility()){
			btns.style.setProperty('display', 'none');
			navCBtn1.innerHTML = '<div class="lang-en lang-pl">Menu</div><div class="lang-ua">Меню</div>';
		} else{
			btns.style.setProperty('display', 'block');
			navCBtn1.innerHTML = '^^^';
		}
	});

	loadPage(settings.lastPage, settings.lang);
});


function loadPage(pageId, lang){
	const nav = document.querySelector('nav');
	const mainBody = document.getElementById('mainBody');
	const updateDelay = randomInt(200,800);

	if(lang === undefined) lang = settings.lang;
	settings.applyLanguage();

	mainBody.innerHTML = cachedData.loading;
	const requestData = {
		method: 'UPDATE',
		headers: {
			'Content-Type': "application/json",
			'Authorization': "Bearer token"
		}
	};

	switch(pageId){
		case -1: /* settings */
			if(cachedData.settings === undefined){
				fetch(host+'settings',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,0,'settings');
					document.getElementById('error_langs').innerHTML = '<div class="lang-en">Current language is</div><div class="lang-pl">Język</div><div class="lang-ua">Мова</div>: ' + settings.lang;
					nav.style.display = 'none';
					loadSettings();
				}).catch((e) => console.error('loadPage: '+e));
			} else{
				updatePage(cachedData.settings,updateDelay);
			}
			break;
		case 0: /*main*/
			if(cachedData.main === undefined){
				fetch(host+'main',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,0,'main');
				}).catch((e) => console.error('loadPage: '+e));
			} else{
				updatePage(cachedData.main,updateDelay);
			}
			break;
		case 1: /*projects*/
			if(cachedData.projects === undefined){
				fetch(host+'projects',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,0,'projects');
					document.getElementById('imgView').innerHTML = jsonData.content.extension;
				}).catch((e) => console.error('loadPage: '+e));
			} else{
				updatePage(cachedData.projects,updateDelay);
			}
			break;
		case 2: /*forms*/
			fetch(host+'forms',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
				cachedData.secondBody = jsonData.content.secondBody;
				loadFields();
			}).catch((e) => console.error('loadPage: '+e));
			break;
		case 3: /*contacts*/
			fetch(host+'contacts',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
			}).catch((e) => console.error('loadPage: '+e));
			break;
		default:
			break;
	}
	if(pageId >= 0) settings.set(pageId);
}

async function updatePage(jsonData,delay=0,cacheName=undefined){
	if(delay>0) await new Promise(wt => setTimeout(wt, delay));
	document.querySelector('header').innerHTML = jsonData.content.header;
	document.getElementById('mainBody').innerHTML = jsonData.content.mainBody;
	document.title = jsonData.content.title;
	if(cacheName) cachedData[cacheName] = jsonData;
}


/*async function loadResource(resArgs, type='text/html'){
	const requestData = {
		method: 'GET',
		headers: {
			'Content-Type': type,
			'Authorization': "Bearer token"
		}
	};
	const response = await fetch(host+'res?'+resArgs, requestData);
	if(!response.ok){
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.text();
}
async function loadResources(){
	cachedData.loading = await loadResource('t=bk&n=loading');
	pureSliderHTML = await loadResource('t=bk&n=pure-slider');
}*/


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


function randomInt(min=0,max=100){
	return min+Math.floor(Math.random() * (max-min+1));
}
