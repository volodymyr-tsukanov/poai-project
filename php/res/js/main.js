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
let cachedData = { loader : '<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>' };

	/*Preload*/
loadResources();


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

	/* Pages */
function loadPage(pageId, lang){
	const mainBody = document.getElementById('mainBody');
	const updateDelay = randomInt(200,800);

	if(lang === undefined) lang = settings.lang;
	settings.applyLanguage();

	mainBody.innerHTML = cachedData.loader;
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
					loadSettings();
					blockUI();
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
				updatePage(cachedData.main);
			}
			break;
		case 1: /*projects*/
			if(cachedData.projects === undefined){
				fetch(host+'projects',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,-randomInt(620,970),'projects');
					cachedData.pureSlider = jsonData.content.extension;
				}).catch((e) => console.error('loadPage: '+e));
			} else{
				updatePage(cachedData.projects);
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
				updatePage(jsonData,-randomInt(340,530));
			}).catch((e) => console.error('loadPage: '+e));
			break;
		default:
			break;
	}
	if(pageId >= 0) settings.set(pageId);
}
async function updatePage(jsonData,delay=0,cacheName=undefined){
	const mainBody = document.getElementById('mainBody');
	if(delay!=0) await new Promise(wt => setTimeout(wt, Math.abs(delay)));
	if(delay<0){	/*preload of images needed*/
		const tempDiv = document.createElement('div');
		const images = tempDiv.getElementsByTagName('img');
		await checkAllImagesLoaded(images);
		mainBody.innerHTML = tempDiv.innerHTML;
		tempDiv.remove();
	}
	document.querySelector('header').innerHTML = jsonData.content.header;
	mainBody.innerHTML = jsonData.content.mainBody;
	document.title = jsonData.content.title;
	if(cacheName) cachedData[cacheName] = jsonData;
}
async function reloadPage(withDelay=true){
	document.getElementById('mainBody').innerHTML = cachedData.loader;
	if(withDelay){
		const delay = randomInt(790,1690);
		await new Promise(wt => setTimeout(wt, delay));
		blockUI();
	}
	location.reload();
}

	/* Resources */
async function loadResource(resArgs, type='text/html'){
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
	const htmlData = await loadResource('t=bk&n=loader');
	if(htmlData && htmlData.length > 9) cachedData.loader = htmlData;
}


	/* Default methods */
function randomInt(min=0,max=100){
	return min+Math.floor(Math.random() * (max-min+1));
}

function blockUI(){
	const nav = document.querySelector('nav');
	nav.style.display = 'none';
}

function checkAllImagesLoaded(images){
	return new Promise((resolve) =>{
		let loaded = 0;
		const total = images.length;
		for(let i=0; i<total; i++){
            const image = images[i];
			if(image.complete) {
				loaded++;
			} else{
				image.onload = () =>{
					loaded++;
					if(loaded === total){
						resolve();
					}
				};
				image.onerror = () =>{
					loadedImages++;
					if (loaded === total) {
						resolve();
					}
				};
			}
		}
		/*if all images are already loaded*/
		if(loaded === total){
			resolve();
		}
	});
}

function showToast(msg='Lets toast!',duration=1000){
	const toast = document.getElementById('toast');
	toast.innerText = msg;
	toast.style.visibility = 'visible';
	setTimeout(() => {
		toast.style.visibility = 'hidden';
	},duration);
}
