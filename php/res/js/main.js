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
/* Main */
	/*Init*/
const host = 'http://localhost/php/poai-project/php/pub/';	/*!default 'http://localhost/'*/

if(window.location.href != host) window.location.replace(host);	/*jump to init*/
let user = new User();
let cachedData = {loader:'<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>', magicWord:'*MGWORD*'};

	/*Preload*/
loadSetupResources();


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

	loadPage(user.lastPage, user.lang);
});

	/* Pages */
function loadPage(pageId, lang){
	const mainBody = document.getElementById('mainBody');
	const updateDelay = randomInt(200,800);

	if(lang === undefined) lang = user.lang;
	user.applyLang();

	displayLoader();

	const requestData = {
		method: 'GET',
		headers: {
			'Content-Type': "application/json",
			'MagicWord': cachedData.magicWord
		}
	};
	switch(pageId){
		case -1: /* settings */
			fetch(host+'settings',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData,0);
				if(jsonData.content.extension === undefined){	/*signed*/
					document.getElementById('error_langs').innerHTML = '<div class="lang-en">Current language is</div><div class="lang-pl">Język</div><div class="lang-ua">Мова</div>: ' + user.lang;
					loadSettings();
					blockUI();
				} else{
					cachedData.signupForm = jsonData.content.extension.html;
					document.getElementById('page_css').innerHTML = jsonData.content.extension.css;
				}
			}).catch((e) => {
				console.error('loadPage: '+e);
				/*reloadPage(false);*/
			});
			break;
		case 0: /*main*/
			if(cachedData.main === undefined){
				fetch(host+'main',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,0,'main');
				}).catch((e) => {
					console.error('loadPage: '+e);
					reloadPage(false);
				});
			} else{
				updatePage(cachedData.main);
			}
			break;
		case 1: /*projects*/
			if(cachedData.projects === undefined){
				fetch(host+'projects',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,-randomInt(620,970),'projects');
					cachedData.pureSlider = jsonData.content.extension.html;
					document.getElementById('page_css').innerHTML = jsonData.content.extension.css;
					document.getElementById('page_js').innerHTML = jsonData.content.extension.js;
				}).catch((e) => {
					console.error('loadPage: '+e);
					reloadPage(false);
				});
			} else{
				updatePage(cachedData.projects);
			}
			break;
		case 2: /*forms*/
			fetch(host+'forms',requestData).then(response => response.json()).then((jsonData) => {
				updatePage(jsonData);
				cachedData.secondBody = jsonData.content.secondBody;
				loadFields();
			}).catch((e) => {
				console.error('loadPage: '+e);
				reloadPage(false);
			});
			break;
		case 3: /*contacts*/
			if(cachedData.contacts === undefined){
				fetch(host+'contacts',requestData).then(response => response.json()).then((jsonData) => {
					updatePage(jsonData,-randomInt(340,530),'contacts');
				}).catch((e) => {
					console.error('loadPage: '+e);
					reloadPage(false);
				});
			} else{
				updatePage(cachedData.contacts);
			}
			break;
		default:
			break;
	}
	if(pageId >= 0) user.setPage(pageId);
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
	document.body.style.cursor = 'default';
}
async function reloadPage(withDelay=true){
	displayLoader(mainBody);
	if(withDelay){
		const delay = randomInt(790,1690);
		await new Promise(wt => setTimeout(wt, delay));
		blockUI();
	}
	location.reload();
}

	/* Resources */
async function loadResource(resArgs){
	const requestData = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': "Bearer token",
			'MagicWord': cachedData.magicWord
		}
	};
	const response = await fetch(host+'res?'+resArgs, requestData);
	if(!response.ok){
		throw new Error(`HTTP error ${response.status}`);
	}
	return await response.json();
}
async function loadSetupResources(){
	const jsonData = await loadResource('t=hc&n=loader');
	if(jsonData){
		var loaderStyle = document.createElement('style');
		loaderStyle.setAttribute('id','ext_loader_css');
		loaderStyle.innerHTML = jsonData.css;
		document.head.appendChild(loaderStyle);
		cachedData.loader = jsonData.html;
	}
}


	/* Default methods */
function randomInt(min=0,max=100){
	return min+Math.floor(Math.random() * (max-min+1));
}

function blockUI(){
	const nav = document.querySelector('nav');
	nav.style.display = 'none';
}

function displayLoader(targetElem=false){
	if(!targetElem) targetElem = document.getElementById('mainBody');
	targetElem.innerHTML = cachedData.loader;
	document.body.style.cursor = 'wait';
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
