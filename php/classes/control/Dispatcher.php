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
    const RESPONSE_GOOD = 'G', RESPONSE_NeXIST = 'E', RESPONSE_WrEQEST = 'R', RESPONSE_WaUTH = 'A';

    
    protected function index(): string{
        $html = AssetManager::getHTMLBlock('index');
        $css = AssetManager::getCSSContent('styles').
            AssetManager::getCSSContent('pure-slider').
            '</style><style>'.AssetManager::getCSSContent('langs'); //langs.css as second style
        $js = AssetManager::getJSContent('forms').
            AssetManager::getJSContent('pure-slider').
            AssetManager::getJSContent('main'); //main always last
        $html = str_replace(['$CSS$','$JS$'],[$css,$js], $html);
        return $html;
    }

    protected function blockRaw(string $blockName): string|bool{
        try{
            $data = AssetManager::getHTMLBlock($blockName);
            return $data;
        }catch(Errorr $err){
            return false;
        }
    }
    protected function block(string $blockName): array{
        $content = explode('$SEP$',AssetManager::getHTMLBlock($blockName));
        $data = [
            'status' => "success",
            'name' => $blockName,
            'v' => "0.1",
            'content' => [
                'title' => "Project VT",
                'header' => $content[0],
                'mainBody' => $content[1]
            ]
        ];
        if(count($content)>2) $data['content']['secondBody'] = $content[2];
        return $data;
    }
}
?>