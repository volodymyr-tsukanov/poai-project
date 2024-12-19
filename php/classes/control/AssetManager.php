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

include_once '../../funcs.php';


class AssetManager {
    public const ASSET_PATH = 'assets/', RES_PATH = '../res/';

    private Warden $w;


    function __construct(){
        $this->w = new Warden();
    }


    private function checkAsset(string $path): string{
        $this->w->getAsset($path);
        if(file_exists($path)){
            return $path;
        } else throw new Errorr($this,ErrorCause::Resource,"Not found asset: $path");
    }
    private function getRes(string $path): string{
        $this->w->getRes($path);
        if(file_exists($path)){
            if(is_readable($path)) return file_get_contents($path);
            else throw new Errorr($this,ErrorCause::FileOperation,"Not readable res: $path");
        } else throw new Errorr($this,ErrorCause::Resource,"Not found res: $path");
    }


    public static function getHTMLBlock(string $name): string{
        $path = self::RES_PATH.'blocks/'.$name.'.html'; 
        $am = new AssetManager();
        return minifyHTML($am->getRes($path));
    }
    public static function getCSSContent(string $name): string{
        $path = self::RES_PATH.'css/'.$name.'.css'; 
        $am = new AssetManager();
        return minifyCSS($am->getRes($path));
    }
    public static function getJSContent(string $name): string{
        $path = self::RES_PATH.'js/'.$name.'.js'; 
        $am = new AssetManager();
        return minifyJS($am->getRes($path));
    }
    public static function getIconPath(string $name): string{
        $path = self::ASSET_PATH.'icons/'.$name; 
        $am = new AssetManager();
        return $am->checkAsset($path);
    }  
}
?>