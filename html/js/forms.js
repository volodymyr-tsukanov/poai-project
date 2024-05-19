// Classes
class Mail {
	constructor(){
		this.sender = 'AnOnYmOuS'
		this.subject = 'NoTiTlE';
		this.body = 'NoTeXt';
		this.abd = this.getAdditionalBrowserData();
	}

	getAdditionalBrowserData(){
		let data = {UA:navigator.userAgent, app:{name:navigator.appName,buildID:navigator.buildID,platform:navigator.platform,productSub:navigator.productSub}, language:navigator.language, plugins:navigator.plugins, screen:{width:screen.width,height:screen.height,ratio:window.devicePixelRatio}};
		return JSON.stringify(data);
	}


	gather(){
		let result = true;
		let regexName = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+( [A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)$/;
		const name = document.getElementById('name');
		const sender = document.getElementById('sender');
		const projects = document.getElementById('prjt');
		const comment = document.getElementById('cmnt');
		const errorName = document.getElementById('error_name');
		const errorSender = document.getElementById('error_sender');
		const errorProject = document.getElementById('error_project');
		const errorComment = document.getElementById('error_comment');

		//Reset errors
		errorName.innerHTML = '';
		errorSender.innerHTML = '';
		errorProject.innerHTML = '';
		errorComment.innerHTML = '';

		//Sender
		if(name.value == null){
			result = false;
			errorName.innerHTML = '<div class="lang-en">Name is needed</div><div class="lang-pl">Podanie imienia jest obowiązkowe</div><div class="lang-ua">???</div>.';
		} else if(!regexName.test(name.value)){
			result = false;
			errorName.innerHTML = '<div class="lang-en">This name unsupported. Try to follow next rules: only letters</div><div class="lang-pl">Imię wprowadzono niepoprawnie</div><div class="lang-ua">???</div>.';
		}

		//Sender
		this.sender = sender.value;
		if(this.sender == null){
			result = false;
			errorSender.innerHTML = '<div class="lang-en">Email is needed</div><div class="lang-pl">Podanie emaila jest obowiązkowe</div><div class="lang-ua">???</div>.';
		}

		//Subject
		this.subject = projects.value;
		if(this.subject == null){
			result = false;
			errorProject.innerHTML = '<div class="lang-en">Subject is needed for mail</div><div class="lang-pl">Nagłówek maila jest wymagany</div><div class="lang-ua">???</div>.';
		}

		//Comment
		this.body = comment.value;
		if(this.body.length < 5){
			result = false;
			errorComment.innerHTML = '<div class="lang-en">Comment is too short. A little more text is needed</div><div class="lang-pl">Komentarz jest za mały. Trzeba dodać jeszcze trochę</div><div class="lang-ua">???</div>.';
		} else if(this.body.length > 300 && comment.value.length < 800){
			errorComment.innerHTML = '<div class="lang-en">Comment is long enough. It can be sent now</div><div class="lang-pl">Komentarz jest wystarczająco długi i może być wysłany</div><div class="lang-ua">???</div>.';
		} else if(this.body.length > 800 && comment.value.length < 1000){
			errorComment.innerHTML = '<div class="lang-en">Comment is too long. It is possible that this commend will be skipped</div><div class="lang-pl">Komentarz jest za długi. On może zostać zignorowany</div><div class="lang-ua"></div>.';
		} else if(this.body.length > 1900){
			errorComment.innerHTML = '<div class="lang-en">I won`t read this comment</div><div class="lang-pl">Ja nie będę tego czytał</div><div class="lang-ua">???</div>&hellip;';
		}

		if(result){
			clearFields();
		}

		return result;
	}

	format(){
		return 'mailto:volodymyr.tsukanov.23@gmail.com?cc=' + this.sender + '&subject=' + this.subject + '&body=' + this.body + '...SpEcIaL...' + this.abd;
	}
}


// Default methods
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


// Form methods
	//Settings
function loadSettings(){
	let index = 0;
	switch(settings.lang){
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
	settings.save();

	document.getElementById('mainBody').innerHTML = loadingHTML;
	reloadCSS().then(()=>loadPage(0)).catch(e=>{
		console.log('Error CSS reset: ' + e);
		loadPage(0);
	});
}
function resetSettings(){
	settings.reset();

	document.getElementById('mainBody').innerHTML = loadingHTML;
	reloadCSS().then(()=>loadPage(0)).catch(e=>{
		console.log('Error CSS reset: ' + e);
		loadPage(0);
	});
}
function clearCashe(){
	localStorage.removeItem('feedback');
}

	//Feedback
function loadFields(){
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
function saveFields(){
	let fields = {};
	fields.name = document.getElementById('name').value;
	fields.sender = document.getElementById('sender').value;
	fields.project = document.getElementById('prjt').value;
	fields.comment = document.getElementById('cmnt').value;
	fields.gender = getRadioIndex('gender');
	localStorage.setItem('feedback', JSON.stringify(fields));
}
function clearFields(){
	document.getElementById('name').value ='';
	document.getElementById('sender').value ='';
	document.getElementById('prjt').value = 'nspec';
	document.getElementById('cmnt').value = '';
	setRadioIndex('gender', 1);
	document.getElementById('error_name').innerHTML = '';
	document.getElementById('error_sender').innerHTML = '';
	document.getElementById('error_project').innerHTML = '';
	document.getElementById('error_comment').innerHTML = '';
}
function resetFields(){
	if(confirm('Reset feedback?')){
		localStorage.removeItem('feedback');
		clearFields();
	}
}
function giveFeedback(){
	let mail = new Mail();
	if(mail.gather()){
		window.open(new URL(mail.format()), '_blank');
		return false;
	}
	else return false;
}
