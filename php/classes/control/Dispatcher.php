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
    protected function index(): string{
        $html = AssetManager::getHTMLBlock('index');
        $css = AssetManager::getCSSContent('styles').
            AssetManager::getCSSContent('pure-slider').
            '</style><style>'.AssetManager::getCSSContent('langs'); //langs.css as second style
        $js = AssetManager::getJSContent('main').
            AssetManager::getJSContent('forms').
            AssetManager::getJSContent('pure-slider');
        $assets = [
            AssetManager::getIconPath('favicon.png'),
            AssetManager::getIconPath('info.png'),
            AssetManager::getIconPath('portfolio.png'),
            AssetManager::getIconPath('comment.png'),
            AssetManager::getIconPath('contacts.png'),
            AssetManager::getIconPath('settings.png')
        ];
        $html = str_replace(['$CSS$','$JS$'],[$css,$js], $html);
        $html = str_replace(['$Aicon$','$Ainfo$','$Aptfo$','$Acomm$','$Acnts$','$Asett$'],$assets, $html);
        return $html;
    }

    protected function block(string $blockName): array{
        $content = explode('$SEP$',AssetManager::getHTMLBlock($blockName));
        return [
            'status' => "success",
            'name' => $blockName,
            'v' => "0.1",
            'content' => [
                'title' => "Project VT",
                'header' => $content[0],
                'mainBody' => $content[1]
            ]
        ];
    }
}
?>