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
	
	// Events
		//Navigation
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

	// Awake
	loadPage(settings.lastPage, settings.lang);

	// Start
});


function loadPage(pageId, lang) {
	var settings = new Settings();
	if(lang == undefined) lang = settings.lang;
	const container = document.getElementById('cntnr');

	switch(pageId){
		case -1: //settings
			container.innerHTML = 'settings';
			break;
		case 0: //main
			container.innerHTML = 'main';
			break;
		case 1: //projects
			container.innerHTML = 'projects';
			break;
		case 2: //forms
			container.innerHTML = 'forms';
			break;
		case 3: //contacts
			container.innerHTML = 'contacts';
			break;
		default:
			container.innerHTML = '! No such page !';
			break;
	}

	settings.set(pageId, lang);
	console.log(pageId, lang);
}
