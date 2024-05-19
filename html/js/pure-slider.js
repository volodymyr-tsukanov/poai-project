function openImageView(index=0){
	const imgView = document.getElementById('imgView');
	fetchPage('blocks/pure-slider.html', imgView, false).then(() => {
		const pureSlider = imgView.children[1];
		const slides = pureSlider.children;
		imgView.style.display = 'block';
		switch(index){
			case 1:
				slides[0].children[2].setAttribute('src', 'assets/icons/favicon.png');
				slides[0].children[2].setAttribute('alt', 'This site');
				removeAfter(pureSlider, 1);
				break;
			case 2:
				slides[0].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-7.jpg?raw=true');
				slides[0].children[2].setAttribute('alt', 'Pear 7');
				slides[1].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-4.jpg?raw=true');
				slides[1].children[2].setAttribute('alt', 'Pear 4');
				slides[2].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-3.jpg?raw=true');
				slides[2].children[2].setAttribute('alt', 'Pear 3');
				slides[3].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-8.jpg?raw=true');
				slides[3].children[2].setAttribute('alt', 'Pear 8');
				slides[4].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/bazy-danych-project-apple/blob/icon/icon/pear-1.jpg?raw=true');
				slides[4].children[2].setAttribute('alt', 'Pear 1');
				break;
			case 3:
				slides[0].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/app_icon.png?raw=true');
				slides[0].children[2].setAttribute('alt', 'Telephone book icon');
				slides[1].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/contact.png?raw=true');
				slides[1].children[2].setAttribute('alt', 'Telephone book contact');
				slides[2].children[2].setAttribute('src', 'https://github.com/volodymyr-tsukanov/telephone-book/blob/main/app/src/main/res/drawable-xhdpi/search.png?raw=true');
				slides[2].children[2].setAttribute('alt', 'Telephone book search');
				removeAfter(pureSlider, 3);
				break;
			default:
				slides[0].children[2].setAttribute('src', 'assets/icons/favicon.png');
				slides[0].children[2].setAttribute('alt', 'Favicon');
				slides[1].children[2].setAttribute('src', 'assets/icons/info.png');
				slides[1].children[2].setAttribute('alt', 'Info');
				removeAfter(pureSlider, 2);
				break;
		}
	});
}

function closeImageView(){
	const imgView = document.getElementById('imgView');
	imgView.style.display = 'none';
}


function removeAfter(elem, index=0){
	console.log(elem.children.length, '-', index, ': ', elem.children);
	for(let i = elem.children.length; i > index; i--) elem.children[index].remove();
}
