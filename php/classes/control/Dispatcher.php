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
    private function renderHead(){
        print('<!DOCTYPE html>
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
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title> Project VT </title>
                
                <!--Import-->
                    <!--Scripts-->
                <script src="'.AssetManager::getScriptPath('main').'"></script>
                <script src="'.AssetManager::getScriptPath('forms').'"></script>
                <script src="'.AssetManager::getScriptPath('pure-slider').'"></script>
                    <!--Styles-->
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('styles').'">
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('langs').'">
                <link rel="stylesheet" type="text/css" href="'.AssetManager::getStylePath('pure-slider').'">
                    <!--Icon-->
                <link rel="icon" type="image/x-icon" href="'.AssetManager::getIconPath('favicon.png').'">
        </head>');
    }
    private function renderBody(){
        print('<body>
            <div id="cntnr">
                <header>HeadeR</header>
                <nav>NaV</nav>
                <!--aside>AsidE</aside-->
                <div id="mainBody">
                    <div class="lang-en">Loading&hellip;</div><div class="lang-pl">Ładowanie&hellip;</div><div class="lang-ua">Завантаження&hellip;</div>
        ');
    }
    protected function renderTail(){
        print('</div>
                <footer> by VT </footer>
            </div>
        </body></html>');
    }

    protected function render($block, array $data = []){
        extract($data);

        $this->renderHead();
        $this->renderBody();
        include AssetManager::getBlockPath($block);
        $this->renderTail();
    }
}
?>