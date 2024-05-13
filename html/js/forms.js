// Classes
class Mail {
	constructor(){
		let s = JSON.parse(localStorage.getItem('settings'));
		if(s == null || s == undefined) this.reset();
		else{
			this.lang = s.lang;
			this.lastPage = s.lastPage;
		}
	}
}


function clearFields(){
	const name = document.getElementById('name');
	const gender = document.getElementByName('gender');
	const projects = document.getElementById('prjt');
	const comment = document.getElementById('cmnt');
	const errorName = document.getElementById('error_name');
	const errorProject = document.getElementById('error_project');
	const errorComment = document.getElementById('error_comment');
}

function giveFeedback(){
	let mail = new Mail();
	return "test";
}
