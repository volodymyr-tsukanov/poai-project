class Settings {
	constructor(){
		let s = JSON.parse(localStorage.getItem('settings'));
		if(s == null || s == undefined) this.reset();
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
	reset(){
		this.lastPage = -1; //load settings page by default
		this.lang = 'en';
		this.save();
	}

	save(){
		const jsonData = { lang : this.lang, lastPage : this.lastPage };
		localStorage.setItem('settings', JSON.stringify(jsonData));
	}
}


//Preload
var settings = new Settings();

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('cntnr');

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
	const mainBody = document.getElementById('mainBody');

	if(lang == undefined) lang = settings.lang;

	switch(pageId){
		case -1: //settings
			fetchPage('blocks/settings.html', mainBody).then(() => {
				const nav = document.querySelector('nav');
				nav.style = 'display:none';
			});
			break;
		case 0: //main
			fetchPage('blocks/main.html', mainBody);
			break;
		case 1: //projects
			fetchPage('blocks/projects.html', mainBody);
			break;
		case 2: //forms
			fetchPage('blocks/forms.html', mainBody);
			break;
		case 3: //contacts
			fetchPage('blocks/contacts.html', mainBody);
			break;
		default:
			break;
	}

	settings.set(pageId, lang);
	console.log(pageId, lang);
}
async function fetchPage(path, element){
	try {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}
		const html = await response.text();
		element.innerHTML = html;
	} catch (e) {
		console.error(e);
	}
}

function saveSettings(){
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
	settings.reset();
}
