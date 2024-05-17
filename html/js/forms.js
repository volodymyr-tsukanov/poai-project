// Classes
class Mail {
	constructor(){
		this.title = 'NoTiTlE';
		this.text = 'NoTeXt';
	}

	gather(){
		let result = true;
		const name = document.getElementById('name');
		const gender = document.getElementsByName('gender');
		const projects = document.getElementById('prjt');
		const comment = document.getElementById('cmnt');
		const errorName = document.getElementById('error_name');
		const errorProject = document.getElementById('error_project');
		const errorComment = document.getElementById('error_comment');

		//Title
		if(projects.value == undefined){
			result = false;
			errorProject.innerHTML = '<div class="lang-en"></div><div class="lang-pl"></div><div class="lang-ua"></div>';
		}

		//Comment
		if(comment.value.length < 5){
			result = false;
			errorComment.innerHTML = '<div class="lang-en">Comment is too short. A little more text is needed</div><div class="lang-pl"></div><div class="lang-ua"></div>';
		}

		if(result){
			clearFields();
		}

		return result;
	}

	format(){
		return 'Title:'+this.title + 'Text:'+this.text;
	}
}


function loadFields(){
	let fields = localStorage.getItem('feedback');
	if(fields && confirm('Load last saved feedback data?')){
		fields = JSON.parse(fields);
		document.getElementById('name').value = fields.name;
		document.getElementById('prjt').value = fields.project;
		document.getElementById('cmnt').value = fields.comment;
	} else console.log('no feedback data');
}
function saveFields(){
	let fields = {};
	fields.name = document.getElementById('name').value;
	fields.project = document.getElementById('prjt').value;
	fields.comment = document.getElementById('cmnt').value;
	localStorage.setItem('feedback', JSON.stringify(fields));
}
function clearFields(){
	document.getElementById('name').value ='';
	document.getElementById('prjt').value = '';
	document.getElementById('cmnt').value = '';
	document.getElementById('error_name').innerHTML = '';
	document.getElementById('error_project').innerHTML = '';
	document.getElementById('error_comment').innerHTML = '';
}

function giveFeedback(){
	let mail = new Mail();
	if(mail.gather()) return mail.format;
	else return false;
}
