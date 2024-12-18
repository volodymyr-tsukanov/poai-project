/*
Copyright (c) 2024 by Ruediger Stursberg (https://codepen.io/stursberg/pen/PoezjG)
Fork of an original work Pure CSS Featured Image Slider (https://codepen.io/joshnh/pen/kOWrXk
edited by volodymyr-tsukanov  2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function openImageView(index=-1){
	const imgView = document.getElementById('imgView');
	imgView.innerHTML = cachedData.pureSlider;
	
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
	for(let i = elems.length; i > index; i--){ elems[index].remove();}
}

function hideAllExcept(elems, index=0){
	let i = 0;
	for(i; i<index; i++){ elems[i].style.display = 'none';}
	elems[index].style.filter = 'blur(3px)';
	for(i=i+1; i < elems.length; i++){ elems[i].style.display = 'none';}
}
function showAll(elems){
	for(let i = 0; i < elems.length; i++){
		elems[i].style.display = '';
		elems[i].style.filter = '';
	}
}