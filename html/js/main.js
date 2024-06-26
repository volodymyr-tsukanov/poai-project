// Classes
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
		this.lastPage = -1; //load settings page by default
		this.lang = 'en';
		this.save();
	}

	applyLanguage(){
		// langs.css
		const styleshit = document.styleSheets[1];
		const ruleIndex = 3;
		
		styleshit.deleteRule(3);
		//console.log('before: ', styleshit);

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
		//console.log('after: ', styleshit);
	}

	save(){
		const jsonData = { lang : this.lang, lastPage : this.lastPage };
		localStorage.setItem('settings', JSON.stringify(jsonData));
	}
}


// Main
	// Preload
const loadingHTML = '<div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>';
var settings = new Settings();

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('cntnr');

	// Awake
	loadPage(settings.lastPage, settings.lang);
});


function loadPage(pageId, lang) {
	const nav = document.querySelector('nav');
	const mainBody = document.getElementById('mainBody');

	if(lang == undefined) lang = settings.lang;
	settings.applyLanguage();

	mainBody.innerHTML = loadingHTML;
	fetchPage('blocks/nav.html', nav, false, true);

	switch(pageId){
		case -1: //settings
			fetchPage('blocks/settings.html', mainBody).then(() => {
				document.getElementById('error_langs').innerHTML = '<div class="lang-en">Current language is</div><div class="lang-pl">Język</div><div class="lang-ua">Мова</div>: ' + settings.lang;
				nav.style.display = 'none';
				loadSettings();
			});
			break;
		case 0: //main
			fetchPage('blocks/main.html', mainBody).then(() => {
				nav.style.display = '';
			});
			break;
		case 1: //projects
			fetchPage('blocks/projects.html', mainBody).then(() => {
				nav.style.display = '';
			});
			break;
		case 2: //forms
			fetchPage('blocks/forms.html', mainBody).then(() => {
				nav.style.display = '';
				loadFields();
			});
			break;
		case 3: //contacts
			fetchPage('blocks/contacts.html', mainBody).then(() => {
				nav.style.display = '';
			});
			break;
		default:
			break;
	}

	if(pageId >= 0) settings.set(pageId);
}


async function fetchPage(path='blocks/main.html', element, modify=true, startup=false){
	try {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}
		const html = await response.text();
		element.innerHTML = html;

		if(modify){
			// Header
			const header = document.querySelector('header');
			const h1 = document.querySelector('h1');
			if(h1){
				header.innerHTML = h1.innerHTML;
				h1.remove();
			}
			else{
				header.innerHTML = 'Main';
				console.error('h1 not found in loaded page');
			}
		}

		if(startup){
		// Events
			//Navigation
			try{
				const navCBtn1 = document.getElementById('navCBtn1');
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
			} catch(e){console.error(e);}
		}
	} catch (e) {
		console.error(e);
	}
}

async function reloadCSS() {
	const lnks = document.getElementsByTagName('link');
	for (let i = 0; i < lnks.length; i++) {
		if (lnks[i].rel === "stylesheet") {
		var href = lnks[i].href.split("?")[0];
		lnks[i].href = href + "?rnd=" + new Date().getMilliseconds();
		}
	}
	await new Promise(wt => setTimeout(wt, 2500));
}
