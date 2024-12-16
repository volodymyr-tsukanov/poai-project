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
namespace project_VT\control\dispatchers;

use project_VT\control\Dispatcher;


class SettingsDispatcher extends Dispatcher {
    private function getHeader(): string{
        return self::renderMinified('<div class="lang-en">Settings</div>
            <div class="lang-pl">Ustawienia</div>
            <div class="lang-ua">Налаштування</div>',false);
    }
    private function getMainBody(): string{
        return self::renderMinified('<form method="POST" onsubmit="saveSettings()" onreset="resetSettings()">
            <fieldset>
                <legend>
                    <div class="lang-en">Select language</div>
                    <div class="lang-pl">Wybranie języka</div>
                    <div class="lang-ua">Виберіть мову</div>
                </legend>
                <input class="rdoA1" type="radio" name="langs" value="en" checked onchange="settings.preview()"><label class="rdoA1"> English</label> <br>
                <input class="rdoA1" type="radio" name="langs" value="pl" onchange="settings.preview()"><label class="rdoA1"> Polski</label> <br>
                <input class="rdoA1" type="radio" name="langs" value="ua" onchange="settings.preview()"><label class="rdoA1"> Українська</label> <br>
                <span id="error_langs" class="error"></span>
            </fieldset>
            <fieldset>
                <legend>
                    <div class="lang-en">Cashed data</div>
                    <div class="lang-pl">Kaszowane dane</div>
                    <div class="lang-ua">Данні кеш</div>
                </legend>
                <button type="button" class="btnA1" onclick="clearCashe()"><div class="lang-en">Clear</div><div class="lang-pl">Wyczyścić</div><div class="lang-ua">Видалити</div></button>
            </fieldset>
            
            <button type="submit" class="btnA1"><div class="lang-en">Apply</div><div class="lang-pl">Zapisać</div><div class="lang-ua">Зберегти</div></button>
            <button type="reset" class="btnA1"><div class="lang-en">Reset</div><div class="lang-pl">Zresetować</div><div class="lang-ua">Скинути</div></button>
            <button type="button" class="btnA1" onclick="loadPage(settings.lastPage)"><div class="lang-en">Go back</div><div class="lang-pl">Wrócić</div><div class="lang-ua">Повернутись</div></button>
        </form>',false);
    }


    public function View(){
        header('Content-Type:application/json');
        $response = [
            'status' => "success",
            'name' => "settings",
            'v' => "0.1",
            'content' => [
                'title' => "Settings",
                'header' => $this->getHeader(),
                'mainBody' => $this->getMainBody()
            ]
        ];
        echo json_encode($response);
    }
}
?>