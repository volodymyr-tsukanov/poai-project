function openImageView(index=-1){
	const imgView = document.getElementById('imgView');
	fetchPage('blocks/pure-slider.html', imgView, false).then(() => {
		const projects = document.getElementsByClassName('project');
		const pureSlider = imgView.children[1];
		const slides = pureSlider.children;

		imgView.style.display = 'block';
		hideAllExcept(projects, index);

		switch(index){
			case 0:
				setImageAttributes(slides[0].children[2], 'assets/icons/favicon.png', 'This site logo');
				removeAfter(pureSlider.children, 1);
				break;
			case 1:
				setImageAttributes(slides[0].children[2], 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-7.jpg?raw=true', 'Pear 7');
				setImageAttributes(slides[1].children[2], 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/raw/main/work/r6/Relational.png', 'Pear database model');
				setImageAttributes(slides[2].children[2], 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-4.jpg?raw=true', 'Pear 4');
				setImageAttributes(slides[3].children[2], 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-3.jpg?raw=true', 'Pear 3');
				setImageAttributes(slides[4].children[2], 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-8.jpg?raw=true', 'Pear 8');
				break;
			case 2:
				setImageAttributes(slides[0].children[2], 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/app_icon.png?raw=true', 'Telephone book icon');
				setImageAttributes(slides[1].children[2], 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/contact.png?raw=true', 'Telephone book contact');
				setImageAttributes(slides[2].children[2], 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/search.png?raw=true', 'Telephone book search');
				removeAfter(pureSlider.children, 3);
				break;
			default:
				setImageAttributes(slides[0].children[2], 'assets/icons/progress-chart.png', 'Upcoming updates');
				setImageAttributes(slides[1].children[2], 'assets/icons/favicon.png', 'Icon');
				removeAfter(pureSlider.children, 2);
				break;
		}
	});
}

function closeImageView(){
	const projects = document.getElementsByClassName('project');
	const imgView = document.getElementById('imgView');

	imgView.style.display = '';
	showAll(projects);
}


function setImageAttributes(elem, src='', alt='Corrupted image'){
	elem.setAttribute('src', src);
	elem.setAttribute('alt', alt);
}

function removeAfter(elems, index=1){
	for(let i = elems.length; i > index; i--) elems[index].remove();
}

function hideAllExcept(elems, index=0){
	let i = 0;
	for(i; i < index; i++) elems[i].style.display = 'none';
	elems[index].style.filter = 'blur(3px)';
	for(i=i+1; i < elems.length; i++) elems[i].style.display = 'none';
}
function showAll(elems){
	for(let i = 0; i < elems.length; i++){
		elems[i].style.display = '';
		elems[i].style.filter = '';
	}
}
