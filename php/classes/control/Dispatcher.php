<?php
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
namespace project_VT\control;


class Dispatcher {
    public static function renderMinified(string $html, $render=true): string{
        // Remove comments
        $html = preg_replace('/<!--.*?-->/s', '', $html);
        // Remove spaces, tabs, newlines
        $html = preg_replace('/\s+/s', ' ', $html);
        // Remove spaces between tags
        $html = preg_replace('/>\s+</', '><', $html);

        if($render) print($html);
        return $html;
    }


    protected function renderHead(){
        self::renderMinified('<!DOCTYPE html><html lang="en"><head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title> Project VT </title>
                
                <!--Import-->
                    <!--Scripts-->
                <script src="'.AssetManager::getScriptPath('main').'" defer></script>
                <script src="'.AssetManager::getScriptPath('forms').'" defer></script>
                <script src="'.AssetManager::getScriptPath('pure-slider').'" async></script>
                    <!--Styles-->
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('styles').'">
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('langs').'">
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('pure-slider').'">
                    <!--Icon-->
                <link rel="icon" type="image/x-icon" href="'.AssetManager::getIconPath('favicon.png').'">
        </head>');
    }
    protected function renderBody(){
        self::renderMinified('<body><div id="cntnr">
            <header>
                <div class="lang-en">Main</div>
                <div class="lang-pl">Główna strona</div>
                <div class="lang-ua">Титульна сторінка</div>
            </header>
            <nav>
                <div id="navBtns">
                    <button id="navBtnMain" class="btnNav" onclick="loadPage(0)">
                        <img class="btnNavIcon" src="'.AssetManager::getIconPath('info.png').'" alt="Main">
                        <div class="btnNavContent">
                            <div class="lang-en">Main</div>
                            <div class="lang-pl">Główna</div>
                            <div class="lang-ua">Головна</div>
                        </div>
                    </button>
                    <button id="navBtnPrjs" class="btnNav" onclick="loadPage(1)">
                        <img class="btnNavIcon" src="'.AssetManager::getIconPath('portfolio.png').'" alt="Proj">
                        <div class="btnNavContent">
                            <div class="lang-en">Projects</div>
                            <div class="lang-pl">Projekty</div>
                            <div class="lang-ua">Проєкти</div>
                        </div>
                    </button>
                    <button id="navBtnFoms" class="btnNav" onclick="loadPage(2)">
                        <img class="btnNavIcon" src="'.AssetManager::getIconPath('comment.png').'" alt="Comm">
                        <div class="btnNavContent">
                            <div class="lang-en">Feedback</div>
                            <div class="lang-pl">Opinia</div>
                            <div class="lang-ua">Відгук</div>
                        </div>
                    </button>
                    <button id="navBtnCots" class="btnNav" onclick="loadPage(3)">
                        <img class="btnNavIcon" src="'.AssetManager::getIconPath('contacts.png').'" alt="Cont">
                        <div class="btnNavContent">
                            <div class="lang-en">Contact</div>
                            <div class="lang-pl">Kontakt</div>
                            <div class="lang-ua">Контакт</div>
                        </div>
                    </button>
                    <button id="navBtnSegs" class="btnNav" onclick="loadPage(-1)">
                        <img class="btnNavIcon" src="'.AssetManager::getIconPath('settings.png').'" alt="Sett">
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
        <div id="mainBody">');
    }
    protected function renderTail(){
        print('</div><footer> by VT </footer></div></body></html>');
    }
}
?>