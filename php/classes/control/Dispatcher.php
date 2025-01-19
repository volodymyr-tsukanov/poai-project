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
    public const RESPONSE_GOOD='G', RESPONSE_BAD='B',   //TODO transit to main.js
                RESPONSE_NeXIST='X', RESPONSE_WrEQEST='E', RESPONSE_WaUTH='A',
                RESPONSE_GlOGIN='L', RESPONSE_GrEGISTER='R', RESPONSE_WuDATA='D', RESPONSE_WpASS='P', RESPONSE_WuNAMEtAKEN='T';

    protected Warden $w;


    function __construct(){
        $this->w = Warden::getInstance();
    }

    
    protected function index(): string{
        $html = AssetManager::getHTMLBlock('index');

        $css = AssetManager::getCSSContent('styles');
        $cssl = AssetManager::getCSSContent('langs');
        $jsh = AssetManager::getJSContent('classes');
        $jsb = AssetManager::getJSContent('forms');
        $magickWord = $this->w->getMGWorldInjection();
        if($magickWord !== false) $jsb .= str_replace('*MGWORD*',$magickWord, AssetManager::getJSContent('main'));
        else $jsb .= AssetManager::getJSContent('main');

        $html = str_replace(['$CSS$','$CSSl$','$JSh$','$JSb$'],[$css,$cssl,$jsh,$jsb], $html);
        return $html;
    }

    protected function htmlRaw(string $blockName): string|bool{
        try{
            $data = AssetManager::getHTMLBlock($blockName);
            return $data;
        }catch(Errorr $err){
            return false;
        }
    }
    protected function cssRaw(string $cssName): string|bool{
        try{
            $data = AssetManager::getCSSContent($cssName);
            return $data;
        }catch(Errorr $err){
            return false;
        }
    }
    protected function jsRaw(string $jsName): string|bool{
        try{
            $data = AssetManager::getJSContent($jsName);
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