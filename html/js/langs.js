const langMain = {
	en: {
		title: "Welcome to our website",
		description: "This is the default content in English."
	},
	es: {
		title: "Bienvenido a nuestro sitio web",
		description: "Este es el contenido predeterminado en español."
	},
	fr: {
		title: "Bienvenue sur notre site web",
		description: "Ceci est le contenu par défaut en français."
	}
};


/*function loadMain(lang) {
	titleElement.textContent = content[lang].title;
	descriptionElement.textContent = content[lang].description;

	const buttons = document.querySelectorAll('.language-switcher button');
	buttons.forEach(button => {
		button.classList.remove('active');
	});
	document.querySelector(`.language-switcher button:nth-child(${lang === 'en' ? 1 : lang === 'es' ? 2 : 3})`).classList.add('active');
}*/
