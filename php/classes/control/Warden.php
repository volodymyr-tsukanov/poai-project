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
    case Shared;
    case Route;
    case Asset;
    case Session;
    case GatherData;
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
    /** Pass $this as caller */
    public function logShared($caller, string $msg){
        $this->logActivity(WardenRizz::Shared,$caller::class.'::'.$msg);
    }

    protected function makeCSRF(): string{
        $B = random_bytes($this->config['csrf-length']);
        return base64_encode($B); //alternative: base64_encode
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


    /**
     * Call in Router->dispatch()
     * returns request params for routing
     */
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

        // Session main
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
        SessionManager::start($this->config['session-main-name']);
            // Regenerate ID
        SessionManager::regenerateId($this->config['session-main-expire']);

        return $req;
    }

    /**
     * Revise every GET asset(located in pub/) request
     * alters requested path
     */
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
    /**
     * Revise every GET resource(located in res/) request
     * alters requested path
     */
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
    /**
     * Call in DTBase->__construct
     * returns db configuration as associative array
     */
    public function getDBparams(): array|false{
        $ini = parse_ini_file('../data/cnf.ini',true);
        if($ini !== false){
            return $ini['db'];
        }
        return false;
    }
    /**
     * Call in Limiter->__construct
     * returns Limiter configuration as associative array
     */
    public function getRLparams(): array|false{
        $ini = parse_ini_file('../data/cnf.ini',true);
        if($ini !== false){
            return $ini['token-bucket'];
        }
        return false;
    }

    /**
     * Filters data from $_GET
     */
    public function gatherGETData(string $name): string|bool{
        $data = filter_input(INPUT_GET,$name,FILTER_DEFAULT);
        if($data === null) return false;
        if($data === false){
            $this->logActivity(WardenRizz::GatherData,'GET::'.$name);
            return false;
        }
        return $data;
    }

    /**
     * Hashes password using options from data/cnf.ini
     */
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
        $csrfName = 'csrf';
        $csrfToken = $this->makeCSRF();
        if($this->config['csrf'] == 2)
            $csrfName = makeMagicWord(explode('_',$this->config['magic-words']),4);
        SessionManager::CSRF($csrfName,$csrfToken);
        return "$csrfName $csrfToken";
    }
    public function checkCSRFinjected(): bool{
        $csrf = SessionManager::CSRF();
        $data = getJsonBody();
        $token = filter_var($data[$csrf['name']],FILTER_DEFAULT);
        $status = $this->config['csrf'];
        if(empty($csrf) && $status == 0) return true;
        if(empty($csrf) && $status > 0){
            $this->logActivity(WardenRizz::Session,'no CSRF on check');
            return false;
        }
        if($token === false || empty($token)){   //no right token in the request
            $this->logActivity(WardenRizz::Session,'CSRF no name='.$csrf['name']);
            return false;
        }
        if(time() - $csrf['time'] > $this->config['csrf-expire']){
            $this->logActivity(WardenRizz::Session,'expired CSRF');
            return false;
        }
        // timing-safe comparison
        $res = hash_equals($csrf['token'],$token);
        if(!$res){
            $this->logActivity(WardenRizz::Session,'wrong CSRF');
        }
        return $res;
    }


    /**
     * Standartize timestamp format as string
     */
    public static function packTime(DateTime $dt): string{
        return $dt->format(self::DATETIME_FORMAT);
    }
}
?>