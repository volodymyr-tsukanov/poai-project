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


class AssetManager {
    const ASSET_PATH = 'res/';

    private Warden $w;


    function __construct(){
        $this->w = new Warden();
    }


    private function checkAsset(string $path): string{
        $this->w->getAsset($path);
        if(file_exists($path)){
            return $path;
        } else throw new Errorr($this,ErrorCause::Resource,"Not found res: $path");
    }


    public static function getStylePath(string $name): string{
        $path = self::ASSET_PATH.'css/'.$name.'.css'; 
        $am = new AssetManager();
        return $am->checkAsset($path);
    }
    public static function getBlockPath(string $name): string{
        $path = self::ASSET_PATH.'blocks/'.$name.'.php'; 
        $am = new AssetManager();
        return $am->checkAsset($path);
    }
    public static function getScriptPath(string $name): string{
        $path = self::ASSET_PATH.'js/'.$name.'.js'; 
        $am = new AssetManager();
        return $am->checkAsset($path);
    }
    public static function getIconPath(string $name): string{
        $path = self::ASSET_PATH.'assets/icons/'.$name; 
        $am = new AssetManager();
        return $am->checkAsset($path);
    }
}
?>