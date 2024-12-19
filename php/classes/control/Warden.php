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
    case Session;
    case GET;
}

class Warden {
    public const DATETIME_FORMAT = 'Y-m-d H:i:s';

    private array $config = [   //TODO update with cnf.ini
        'session-expire'=>2000,
        'session-name-variator'=>1,
        'csrf'=>1,
        'pass-algorithm'=>PASSWORD_ARGON2I,
        'pass-bcrypt-cost'=>12,
        'pass-argon-memory_cost'=>49152,    //48MB
        'pass-argon-time_cost'=>4,          //iterations
        'pass-argon-threads'=>3             //parallel threads
    ];


    function __construct(){
        $ini = parse_ini_file('../data/cnf.ini',true);
        if($ini !== false){
            foreach(array_keys($ini['warden-rules']) as $key){
                $this->config[$key] = $ini['warden-rules'][$key];
            }
        }
        else $this->logActivity(WardenRizz::Debug,'no cnf.ini');
    }


    private function alarm(string $msg){

    }
    protected function logActivity(WardenRizz $rizzon, string $msg){
        $sep = '|';
        $logEntry = date(self::DATETIME_FORMAT) .$sep.$_SERVER['REMOTE_ADDR'].$sep. $rizzon->name .'=>'. $msg;

        $fl = fopen('1.log','a');
        fwrite($fl,$logEntry."\n");
        fclose($fl);
    }

    protected function makeCSRF(): string{
        $B = random_bytes($this->config['csrf-length']);
        return bin2hex($B); //alternative: base64_encode
    }
    protected function validateCSRF(?string $csrfToken): int{
        if(empty($_SESSION['csrf']) || empty($csrfToken)){
            $this->logActivity(WardenRizz::Session,'no CSRF');
            return 0;
        }
        if(time() - $_SESSION['csrf']['time'] > $this->config['csrf-expire']){
            $this->logActivity(WardenRizz::Session,'expired CSRF');
            return 0;
        }
        // timing-safe comparison
        $res = hash_equals($_SESSION['csrf']['token'],$csrfToken);
        unset($_SESSION['csrf']);
        if($res) return 1;  //good
        return -1;  //bad
    }

    protected function secureHeaders(){
        header("X-Frame-Options: DENY");
        header("X-XSS-Protection: 1; mode=block");
        header("X-Content-Type-Options: nosniff");

        ini_set('session.cookie_httponly', '1'); // Prevent JS access
        //ini_set('session.cookie_secure', '1');   // Require HTTPS
        ini_set('session.use_only_cookies', '1'); // No URL-based sessions
        ini_set('session.cookie_samesite', 'Strict'); // Prevent CSRF
    }


    public function dispatch(): array{
        $req = array();
        $req['uri'] = strtok($_SERVER['REQUEST_URI'], '?');
        $req['method'] =  $_SERVER['REQUEST_METHOD'];

        // Routing
        if(strpos($req['uri'],'/data/') !== false || strpos($req['uri'],'.ini') !== false){
            $this->logActivity(WardenRizz::Route,'Accessing: '.$req['method'].'::'.$req['uri']);
            $req['uri'] = '/';
        }
        if(strpos($req['uri'], '/res/') !== false){
            $this->logActivity(WardenRizz::Route,'Accessing: '.$req['method'].'::'.$req['uri']);
            $req['uri'] = '/';
        }

        // Session
            // Secure cookie parameters
        $cookieParams = session_get_cookie_params();
        session_set_cookie_params([
            'lifetime' => $cookieParams['lifetime'],
            'path' => '/',
            'domain' => $_SERVER['HTTP_HOST'],
            'secure' => true,
            //'httponly' => true,    //requires htpps
            'samesite' => 'Strict'
        ]);
            // Name
        if($this->config['session-name-variator'] == 1){
            $magicWord = getallheaders()['MagicWord'];
            if(!isset($magicWord) || strlen($magicWord)>18)
                session_name(makeMagicWord(explode('_',$this->config['magic-words'])));
            else session_name(htmlspecialchars($magicWord));
        } else session_name('SSID');
        session_start();
    // Regenerate ID TODO use db here
/*if (!isset($_SESSION['last_regeneration'])){
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
} else if (time() - $_SESSION['last_regeneration'] ?? 0 > $this->config['session-expire']) {
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
}*/
            //UserAgent
        if($this->config['ua'] == 1){
            if(!isset($_SESSION['user_agent'])){
                $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
            } else if($_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']){
                sessionDestroy();
                $this->logActivity(WardenRizz::Session,'hijacker on '.$_SERVER['HTTP_USER_AGENT']);
            }
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
    public function getDBparams(): array|false{
        $ini = parse_ini_file('../data/cnf.ini',true);
        if($ini !== false){
            return $ini['db'];
        }
        return false;
    }

    public function gatherGETData(string $name): string|bool{
        $data = filter_input(INPUT_GET,$name,FILTER_DEFAULT);
        if($data === null) return false;
        if($data === false){
            $this->logActivity(WardenRizz::GET,$name);
            return false;
        }
        return $data;
    }

    public function protectPasswd(string $password): string{
        $options = [];
        $algorithm = $this->config['pass-algorithm'];
        switch($algorithm){
            case PASSWORD_BCRYPT:
                $options = [
                    'cost' => $this->config['pass-bcrypt-cost']
                ];
                break;
            default:
                $algorithm = PASSWORD_ARGON2I;
            case PASSWORD_ARGON2I:
            case PASSWORD_ARGON2ID:
                $options = [
                    'memory_cost' => $this->config['pass-argon-memory_cost'],
                    'time_cost'   => $this->config['pass-argon-time_cost'],
                    'threads'     => $this->config['pass-argon-threads']
                ];
                break;
        }
        return password_hash($password, $algorithm, $options);
    }

    public function getCSRFinjection(): string{
        $csrfToken = $this->makeCSRF();
        switch($this->config['csrf']){
            case '1':
                $_SESSION['csrf'] = [
                    'token'=>$csrfToken,
                    'time'=>time()
                ];
                break;
        }
        return $csrfToken;
    }
    public function checkCSRFinjected(?string $csrfToken){
        switch($this->validateCSRF($csrfToken)){
            case 0: //neutral
                $this->logActivity(WardenRizz::Debug,'csrf N');
                break;
            case 1: //good
                $this->logActivity(WardenRizz::Debug,'csrf G');
                break;
            default:    //bad
                $this->logActivity(WardenRizz::Debug,'csrf B');
                break;
        }
    }

    public function reviseInit(string &$html){
        if($this->config['session-name-variator'] == 1){
            $html = str_replace('$SESSIONAME$',session_name(),$html);
        }
    }


    public static function packTime(DateTime $dt): string{
        return $dt->format(self::DATETIME_FORMAT);
    }
}
?>