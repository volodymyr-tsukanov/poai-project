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

use DateTime;


enum WardenRizz {
    case Debug;
    case Route;
    case Asset;
}

class Warden {
    const DATETIME_FORMAT = 'Y-m-d H:i:s';


    private function alarm(string $msg){

    }
    protected function logActivity(WardenRizz $rizzon, string $msg){
        $logEntry = date(self::DATETIME_FORMAT) .': '. $rizzon->name .'=>'. $msg;

        $fl = fopen('1.log','a');
        fwrite($fl,$logEntry."\n");
        fclose($fl);
    }


    public function dispatch(): array{
        $req = array();
        $req['uri'] = strtok($_SERVER['REQUEST_URI'], '?');
        $req['method'] =  $_SERVER['REQUEST_METHOD'];

        $this->logActivity(WardenRizz::Debug,$req['method'].'::'.$req['uri']);
        if(strpos($req['uri'], '/data/') !== false){
            $this->logActivity(WardenRizz::Route, 'Accessing data: '.$req['uri']);
        }
        if(strpos($req['uri'], '/res/') !== false){
            $this->logActivity(WardenRizz::Route, 'Accessing res: '.$req['uri']);
        }

        return $req;
    }

    public function getAsset(string& $path){
        //Check if the path is not default asset path
        if(!str_starts_with($path, AssetManager::ASSET_PATH)){
            $pathStart = substr($path,0,7);
            $msg = "as asset at '$path'";
            $this->logActivity(WardenRizz::Asset,$path);
            switch($pathStart){
                case '../clas':
                case '../res/':
                    break;
                case '../data':
                    $this->alarm('UNWANTED ACCESS to ../data '.$msg);
                    break;
                default:
                    break;
            }
            $path = AssetManager::ASSET_PATH.$path;
        }
    }
    public function getRes(string& $path){
        //Check if the path is not default asset path
        if(!str_starts_with($path, AssetManager::RES_PATH)){
            $pathStart = substr($path,0,7);
            $msg = "as res at '$path'";
            $this->logActivity(WardenRizz::Asset,$path);
            switch($pathStart){
                case 'asset/i':
                    break;
                case '../clas':
                    break;
                case '../data':
                    $this->alarm('UNWANTED ACCESS to ../data '.$msg);
                    break;
                default:
                    break;
            }
            $path = AssetManager::RES_PATH.$path;
        }
    }


    public static function protectPasswd(string $password, string $algorithm = PASSWORD_ARGON2I): string{
        $options = [];
        switch($algorithm) {
            case PASSWORD_BCRYPT:
                $options = [
                    'cost' => 12    //recommended cost factor
                ];
                break;
            default:
                $algorithm = PASSWORD_ARGON2I;
            case PASSWORD_ARGON2I:
            case PASSWORD_ARGON2ID:
                $options = [
                    'memory_cost' => 49152,    //48MB
                    'time_cost'   => 4,        //iterations
                    'threads'     => 3         //parallel threads
                ];
                break;
        }
        return password_hash($password, $algorithm, $options);
    }

    public static function packTime(DateTime $dt): string{
        return $dt->format(self::DATETIME_FORMAT);
    }
}
?>