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
