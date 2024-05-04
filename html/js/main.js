class Settings {
	constructor(){
		let s = JSON.parse(localStorage.getItem('settings'));
		if(s == null || s == undefined){
			this.lastPage = -1; //load settings page by default
			this.lang = 'en';
			this.save();
		}
		else{
			this.lang = s.lang;
			this.lastPage = s.lastPage;
		}
	}

	set(pageId, lang){
		if(pageId != undefined) this.lastPage = pageId;
		if(lang != undefined) this.lang = lang;
		this.save();
	}

	save(){
		const jsonData = { lang : this.lang, lastPage : this.lastPage };
		localStorage.setItem('settings', JSON.stringify(jsonData));
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Preload
	var settings = new Settings();

	// Awake
	loadPage(settings.lastPage, settings.lang);
	
	// Events
		//Navigation
	try{
		document.getElementById('navBtnMain').addEventListener('click', ()=> {
			loadPage(0);
		});
		document.getElementById('navBtnPrjs').addEventListener('click', ()=> {
			loadPage(1);
		});
		document.getElementById('navBtnFoms').addEventListener('click', ()=> {
			loadPage(2);
		});
		document.getElementById('navBtnCots').addEventListener('click', ()=> {
			loadPage(3);
		});
	} catch(e){console.error(e);}

	// Start
});


function loadPage(pageId, lang) {
	var settings = new Settings();
	if(lang == undefined) lang = settings.lang;
	const navigation = document.getElementById('navBtns');
	const mainBody = document.getElementById('mainBody');

	switch(pageId){
		case -1: //settings
			mainBody.innerHTML = 'settings';
			fetch('blocks/settings.html')
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}
				return response.text();
			}).then(html => {
				mainBody.innerHTML = html;
			}).catch(e => {
				console.error(e);
			});
			break;
		case 0: //main
			mainBody.innerHTML = 'main';
			break;
		case 1: //projects
			mainBody.innerHTML = 'projects';
			break;
		case 2: //forms
			mainBody.innerHTML = 'forms';
			break;
		case 3: //contacts
			mainBody.innerHTML = 'contacts';
			break;
		default:
			mainBody.innerHTML = '! No such page !';
			break;
	}

	settings.set(pageId, lang);
	console.log(pageId, lang);
}

function saveSettings(){
	var settings = new Settings();
	let lang = 'en';
	let sl = document.getElementsByName('settingsLangs');
	for(let i = 0; i < sl.length; i++){
		if(sl[i].checked){
			lang = sl[i].value;
			break;
		}
	}
	settings.set(0, lang);
}
function resetSettings(){

}
