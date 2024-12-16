<!--
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
-->
<div id="cntnr">
	<header>
		<div class="lang-en">Main</div>
		<div class="lang-pl">Główna strona</div>
		<div class="lang-ua">Титульна сторінка</div>
	</header>
	<nav>
		<div id="navBtns">
			<button id="navBtnPrjs" class="btnNav" onclick="loadPage(1)">
				<img class="btnNavIcon" src="<?php echo project_VT\control\AssetManager::getIconPath('portfolio.png'); ?>" alt="Proj">
				<div class="btnNavContent">
					<div class="lang-en">Projects</div>
					<div class="lang-pl">Projekty</div>
					<div class="lang-ua">Проєкти</div>
				</div>
			</button>
			<button id="navBtnFoms" class="btnNav" onclick="loadPage(2)">
				<img class="btnNavIcon" src="<?php echo project_VT\control\AssetManager::getIconPath('comment.png'); ?>" alt="Comm">
				<div class="btnNavContent">
					<div class="lang-en">Feedback</div>
					<div class="lang-pl">Opinia</div>
					<div class="lang-ua">Відгук</div>
				</div>
			</button>
			<button id="navBtnCots" class="btnNav" onclick="loadPage(3)">
				<img class="btnNavIcon" src="<?php echo project_VT\control\AssetManager::getIconPath('contacts.png'); ?>" alt="Cont">
				<div class="btnNavContent">
					<div class="lang-en">Contact</div>
					<div class="lang-pl">Kontakt</div>
					<div class="lang-ua">Контакт</div>
				</div>
			</button>
			<button id="navBtnSegs" class="btnNav" onclick="loadPage(-1)">
				<img class="btnNavIcon" src="<?php echo project_VT\control\AssetManager::getIconPath('settings.png'); ?>" alt="Sett">
				<div class="btnNavContent">
					<div class="lang-en">Settings</div>
					<div class="lang-pl">Ustawienia</div>
					<div class="lang-ua">Налаштування</div>
				</div>
			</button>
		</div>
		<div id="navClosed"> VV/ -|- \VV </div>
		<button id="navCBtn1">
			<div class="lang-en lang-pl">Menu</div>
			<div class="lang-ua">Меню</div>
		</button>
	</nav>
	<!--aside>AsidE</aside-->
	<div id="mainBody">
		<div class="lang-en" style="text-align:center;">
			Hello everyone! <div class="smlA1">👋</div> <br>
			I'm <i>&nu;olodymyr</i>, student of Politechnika Lubelska university in Poland. <br>
			Welcome to my <b>portfolio</b> page!
			It was made as a project for one of my subjects (so I've left the requirements for my below for my professor) and contains a list of my works, a review page and my contact information.
		</div>
		<div class="lang-pl" style="text-align:center;">
			Witam wszystkich! <div class="smlA1">👋</div> <br>
			Nazywam się <i>&nu;olodymyr</i>, jestem studentem Politechniki Lubelskiej w Polsce.
			Zapraszam na stronę z moim <b>portfolio</b>!
			Została ona stworzona jako projekt dla jednego z moich przedmiotów (więc zostawiłem poniżej wymagania dla mojego profesora) i zawiera listę moich prac, stronę z recenzjami i moje dane kontaktowe.
		</div>
		<div class="lang-ua" style="text-align:center;">
			Мої вітання! <div class="smlA1">👋</div> <br>
			Мене звати <i>&nu;olodymyr</i>, я студент Politechniki Lubelskiej (Польща).
			Радий вас бачити на моїй <b>сторінці-портфоліо</b>!
			Я створив її як проєкт для одного з моїх предметів (інформація для моєї професорки нижче). Вона містить в собі список моїх робіт, формуляр для відгуків й мою контактну інформацію.
		</div> <br>
		<div class="embededCode">
			<h4>Wymagania dotyczące projektu końcowego z Podstaw aplikacji internetowych:</h4>
			|  1. Projekt końcowy powinien być utworzony indywidualnie przez każdego studenta. Nie
			może to być modyfikacja projektu tworzonego w trakcie zajęć laboratoryjnych. Proszę
			przygotować własne treści i materiały graficzne.<br>
			|  2. Temat projektu jest dowolny, ale powinna to być aplikacja stanowiąca pewną spójną
			całość.<br>
			|  3. Szatę graficzną i interfejs użytkownika aplikacji można przygotować samodzielnie albo
			z wykorzystaniem darmowego szablonu, który zostanie zaadaptowany na potrzeby
			tworzonej aplikacji. Powinny być spełnione założenia projektu responsywnego.<br>
			|  4. Tworzona aplikacja (typu MPA lub SPA), powinna udostępniać responsywny element
			nawigacyjny z dostępem do treści statycznych i treści tworzonych dynamicznie za
			pomocą JavaScript (np. baner ze zdjęciami, przeglądarka zdjęć, mapy google itp.). Można
			w tym celu wykorzystać funkcje z biblioteki jQuery, Bootstrap lub inne.<br>
			|  5. Co najmniej jedna strona powinna zawierać rozbudowany formularz zawierający pola
			tekstowe, przyciski typu radio i chceckbox, listę wyboru, przyciski button itp. Wszystkie
			formularze w aplikacji powinny być walidowane w HTML i/lub w JavaScript.
			Komunikaty o błędach powinny być jasne i czytelne. Po sprawdzeniu poprawności
			danych wprowadzonych do formularza, dane te powinny być zapisywane (najlepiej
			w formacie JSON) w lokalnym magazynie danych (localStorage/sessionStorage). Dane
			z tego magazynu powinny być dostępne z poziomu interfejsu aplikacji do podglądu,
			modyfikacji i usuwania.<br>
			|  6. Aby uzyskać maksymalną liczbę punktów za projekt końcowy - aplikacja powinna
			dodatkowo modyfikować wybrane fragmenty strony za pomocą treści wczytywanych
			z plików na serwerze w trybie asynchronicznym, najlepiej za pomocą interfejsu Fetch
			API.<br>
			|  7. Kod HTML5 oraz arkusze CSS powinny być zgodne ze standardami W3C - walidacja nie
			powinna wykazywać błędów. Będzie oceniana jakość i przejrzystość kodu.<br>
			|  8. Ostateczny termin oddania projektu (zaliczenie laboratorium) to ostatnie zajęcia
			laboratoryjne każdej grupy.
		</div>
	</div>
	<footer> by VT </footer>
</div>