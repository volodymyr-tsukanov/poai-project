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
class User {
	constructor(){
		let u = JSON.parse(localStorage.getItem('user'));
		if(!u) this.resetPage();
		else this.load(u);
	}

	previewLang(){
		const sl = document.getElementsByName('langs');
		for(let i = 0; i < sl.length; i++){
			if(sl[i].checked){
				this.lang = sl[i].value;
				break;
			}
		}
		this.applyLang();
	}
	updateLang(){
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
	setPage(pageId, lang){
		if(pageId !== undefined) this.lastPage = pageId;
		if(lang !== undefined) this.lang = lang;
		this.save();
	}
	resetPage(){
		this.lastPage = 0; /*load Main page by default*/
		this.lang = 'en';
		this.save();
	}

	applyLang(){
		const styleshit = document.styleSheets[1];	/*langs must be second style*/
		const ruleIndex = 3;
		
		styleshit.deleteRule(ruleIndex);

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

	gather(){
		let result = true;
		let regexName = /^([A-Za-z])*$/;
		let regexPass = /^([A-Za-z0-9\*\.\/\-\=\+\^\$\!\@\#\%\&\(\)\:])*$/;
		const uname = document.getElementById('sf_uname');
		const pass = document.getElementById('sf_pass');
		const errorUname = document.getElementById('error_uname');
		const errorPass = document.getElementById('error_pass');

		/*Reset errors*/
		errorUname.innerHTML = '';
		errorPass.innerHTML = '';
		
		/*Username*/
		if(uname.value === null){
			result = false;
			errorUname.innerHTML = '<div class="lang-en">userName is needed</div><div class="lang-pl">Podanie userName jest obowiązkowe</div><div class="lang-ua">Поділіться userName хочаб</div>.';
		} else if(uname.value.length < 4 || uname.value.length > 30){
			result = false;
			errorUname.innerHTML = '<div class="lang-en">Entered userName has improper length. Try to follow next rules: 4-30 symbols</div><div class="lang-pl">Wprowadzony userName ma niepoprawną długość</div><div class="lang-ua">Або ваш userName дійсно має стільки букв, або&hellip;</div>.';
		} else if(!regexName.test(uname.value)){
			result = false;
			errorUname.innerHTML = '<div class="lang-en">Entered userName unsupported. Try to follow next rules: only letters A-Z</div><div class="lang-pl">UserName wprowadzono niepoprawnie</div><div class="lang-ua">?</div>.';
		}

		/*Password*/
		if(pass.value === null){
			result = false;
			errorPass.innerHTML = '<div class="lang-en">C\'mon password is needed</div><div class="lang-pl">Podanie hasła jest obowiązkowe</div><div class="lang-ua">?</div>.';
		} else if(pass.value.length < 8 || pass.value.length > 30){
			result = false;
			errorPass.innerHTML = '<div class="lang-en">Entered password has improper length. Try to follow next rules: 4-30 symbols</div><div class="lang-pl">Wprowadzone hasło ma niepoprawną długość</div><div class="lang-ua">?</div>.';
		} else if(!regexPass.test(pass.value)){
			result = false;
			errorPass.innerHTML = '<div class="lang-en">Entered password unsupported. Try to follow next rules: letters, digits, symbols #$!@%^&*/-+</div><div class="lang-pl">Imię wprowadzono niepoprawnie</div><div class="lang-ua">Я сумніваюся що існують реальні імена з такими знаками</div>.';
		}

		if(result){
			this.uname = uname.value;
			this.pass = pass.value;
			this.save();
		}
		return result;
	}

    format(){
        const jsonData = {username:this.uname, pass:this.pass};
        return JSON.stringify(jsonData);
    }
	save(){
		const jsonData = {lang:this.lang, lastPage:this.lastPage};
		localStorage.setItem('user', JSON.stringify(jsonData));
	}
	load(jsonData){
		this.lang = jsonData.lang;
		this.lastPage = jsonData.lastPage;
	}
}


class Letter {
	constructor(){
		this.sender = 'AnOnYmOuS';
		this.subject = 'NoTiTlE';
		this.message = 'NoTeXt';
		this.abd = this.getAdditionalBrowserData();
	}

	getAdditionalBrowserData(){
		let data = {UA:navigator.userAgent, app:{name:navigator.appName,buildID:navigator.buildID,platform:navigator.platform,productSub:navigator.productSub}, language:navigator.language, plugins:navigator.plugins, screen:{width:screen.width,height:screen.height,ratio:window.devicePixelRatio}};
		return JSON.stringify(data);
	}


	gather(){
		let result = true;
		let regexName = /^([A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s])*$/;
		const sender = document.getElementById('sender');
		const email = document.getElementById('email');
		const projects = document.getElementById('prjt');
		const comment = document.getElementById('cmnt');
		const errorSender = document.getElementById('error_sender');
		const errorEmail = document.getElementById('error_email');
		const errorProject = document.getElementById('error_project');
		const errorComment = document.getElementById('error_comment');

		/*Reset errors*/
		errorSender.innerHTML = '';
		errorEmail.innerHTML = '';
		errorProject.innerHTML = '';
		errorComment.innerHTML = '';

		/*Name*/
		if(sender.value == null){
			result = false;
			errorSender.innerHTML = '<div class="lang-en">Name is needed</div><div class="lang-pl">Podanie imienia jest obowiązkowe</div><div class="lang-ua">Поділіться іменем хочаб</div>.';
		} else if(sender.value.length < 4 || sender.value.length > 70){
			result = false;
			errorSender.innerHTML = '<div class="lang-en">Entered name has improper length. Try to follow next rules: 4-30 symbols</div><div class="lang-pl">Wprowadzone imię ma niepoprawną długość</div><div class="lang-ua">Або ваше ім\'я дійсно має стільки букв, або&hellip;</div>.';
		} else if(!regexName.test(sender.value)){
			result = false;
			errorSender.innerHTML = '<div class="lang-en">Entered name unsupported. Try to follow next rules: only letters</div><div class="lang-pl">Imię wprowadzono niepoprawnie</div><div class="lang-ua">Я сумніваюся що існують реальні імена з такими знаками</div>.';
		} else this.sender = sender.value;

		/*Sender*/
		if(email.value === null){
			result = false;
			errorEmail.innerHTML = '<div class="lang-en">Email is needed</div><div class="lang-pl">Podanie emaila jest obowiązkowe</div><div class="lang-ua">Відкрийте мені цей секрет</div>.';
		} else this.email = email.value;

		/*Subject*/
		if(projects.value === null){
			result = false;
			errorProject.innerHTML = '<div class="lang-en">Subject is needed for mail</div><div class="lang-pl">Nagłówek maila jest wymagany</div><div class="lang-ua">Виберіть тему для повідомлення</div>.';
		} else this.subject = projects.value;

		/*Comment*/
		if(comment.value.length < 5){
			result = false;
			errorComment.innerHTML = '<div class="lang-en">Comment is too short. A little more text is needed</div><div class="lang-pl">Komentarz jest za mały. Trzeba dodać jeszcze trochę</div><div class="lang-ua">Невже? І це все? Я думав що зможете більше</div>.';
		} else if(comment.value > 1900){
			result = false;
			errorComment.innerHTML = '<div class="lang-en">I won`t read this comment</div><div class="lang-pl">Ja nie będę tego czytał</div><div class="lang-ua">Я не читаю баллади</div>&hellip;';
		} else if(comment.value.length > 1000){
			errorComment.innerHTML = '<div class="lang-en">Comment is too long. It is possible that this commend will be skipped</div><div class="lang-pl">Komentarz jest za długi. On może zostać zignorowany</div><div class="lang-ua">Правда вже достатньо</div>.';
		} else if(comment.value.length > 800){
			errorComment.innerHTML = '<div class="lang-en">Comment is long enough. It can be sent now</div><div class="lang-pl">Komentarz jest wystarczająco długi i może być wysłany</div><div class="lang-ua">Добре, цього досить</div>.';
		} this.message = comment.value;	/*no else*/

		if(result){
			clearFeedbackFields();
		}
		return result;
	}

	format(){
		const jsonData = {'subject':this.subject,'message':this.message,'sender':this.sender,'email':this.email,'abd':this.abd};
		return JSON.stringify(jsonData);
	}
	load(jsonData){

	}
}