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
use project_VT\interfaces\DTBase;
use project_VT\control\dispatchers\SettingsDispatcher;


enum WardenRizz {
    case Debug;
    case Shared;
    case Route;
    case Asset;
    case Session;
    case GatherData;
}

class Warden {
    private static ?Warden $instance = null;

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


    protected function __construct(){
        $ini = parse_ini_file('../data/cnf.ini',true);
        if($ini !== false){
            foreach(array_keys($ini['warden-rules']) as $key){
                $this->config[$key] = $ini['warden-rules'][$key];
            }
            self::$instance = $this;
        }
        else $this->logActivity(WardenRizz::Debug,'no cnf.ini');
    }

    public static function getInstance(): Warden{
        if(self::$instance === null) self::$instance = new Warden();
        return self::$instance;
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
        return base64_encode($B);
    }
    protected function makeUToken(): string{
        $B = random_bytes($this->config['user-token-length']);
        return bin2hex($B);
    }

    protected function getBrowserFootprint(): string{
        return '';
    }


    /**
     * Initializes session
     * Call after Limiter initialization before DTBase
     */
    public function awakeSession(){
        $db = DTBase::getInstance();

        // Secure headers
        if($this->config['headers-secure'] != 0){
            header("X-Frame-Options: DENY");
            header("X-XSS-Protection: 1; mode=block");
            header("X-Content-Type-Options: nosniff");

            ini_set('session.cookie_httponly', '1'); // Prevent JS access
            //ini_set('session.cookie_secure', '1');   // Require HTTPS
            ini_set('session.use_only_cookies', '1'); // No URL-based sessions
            ini_set('session.cookie_samesite', 'Strict'); // Prevent CSRF
        }

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
        $sn = $this->config['session-name'];
        if($this->config['session-name-variator'] == 1){
            $magicWord = getallheaders()['MagicWord'];
            if(!isset($magicWord)){
                $sn = makeMagicWord(explode('_',$this->config['magic-words']));
            } else if(strlen($magicWord)<18) $sn = htmlspecialchars($magicWord);
            else{   //TODO log behaviour
                echo "!MGWORD suspicious";
                exit();
            }
        }
        SessionManager::start($sn);
        // Regenerate ID
        SessionManager::regenerateId($this->config['session-expire']);
        
        // Rate limits
        if($this->config['limiter'] != 0){
            if($this->config['limiter-naughtyList'] != 0){
                $reqIp = inet_pton($_SERVER['REMOTE_ADDR']);
                $db->enable();
                $ipData = $db->selectNaughtyList($reqIp);
                if($ipData !== null){
                    header('HTTP/1.0 403 Forbidden');
                    echo "NAUGHTY";
                    exit();
                }
            }
            $l = new Limiter();
            $l_result = $l->checkLimit();
            switch($l_result['res']){
                case LimitResult::BlockIP:
                    if($this->config['limiter-naughtyList'] != 0){
                        if($ipData === null){   //not in list => insert
                            $ipData = [
                                'ip'=>$reqIp,
                                'reason'=>(int)LimitReason::RateLimit,
                                'abd'=>$this->getBrowserFootprint()
                            ];
                            $db->insertNaughtyList($ipData);
                        } else{ //already in list => update range
                            echo "Blocked";
                        }
                    }
                    header('HTTP/1.0 403 Forbidden');
                    echo "In naughty list: ".(int)$l_result['riz'];
                    //TODO contact mail for recovery
                    exit();
                case LimitResult::BucketFailure:
                case LimitResult::TooManyRequests:
                    header('HTTP/1.1 429 Too Many Requests');
                    header('Retry-After: ' . (60-time()%60));
                    echo $l->getRemainingTokens();
                    exit();
                case LimitResult::Ok;
                    break;
            }
        }

        //UserAgent
        if($this->config['ua'] == 1){
            $userAgent = SessionManager::userAgent();
            if(empty($userAgent)){
                SessionManager::userAgent($_SERVER['HTTP_USER_AGENT']);
            } else if($userAgent !== $_SERVER['HTTP_USER_AGENT']){
                SessionManager::destroy();
                $this->logActivity(WardenRizz::Session,'hijacker on '.$_SERVER['HTTP_USER_AGENT']);
            }
        }
    }

    /**
     * Call in Router->dispatch()
     * returns request params for routing
     */
    public function dispatch(): array{
        $req = array();
        $req['uri'] = strtok($_SERVER['REQUEST_URI'], '?');
        $req['method'] =  $_SERVER['REQUEST_METHOD'];

        if($this->config['session-name-variator'] == 1){
            if(!SessionManager::isSigned() && !Router::isDefaultRoute($req['uri'])){
                $this->logActivity(WardenRizz::Session,"wrong name");
                $req['uri'] = '/';  //TODO fix multi session
                SessionManager::sign();
            } else{
                SessionManager::sign();
            }
        }

        // Routing
        if(strpos($req['uri'],'/data/') !== false || strpos($req['uri'],'.ini') !== false){
            $this->logActivity(WardenRizz::Route,'Accessing: '.$req['method'].'::'.$req['uri']);
            $req['uri'] = '/';
        }
        if(strpos($req['uri'], '/res/') !== false){
            $this->logActivity(WardenRizz::Route,'Accessing: '.$req['method'].'::'.$req['uri']);
            $req['uri'] = '/';
        }

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


        // Data gathering
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


        // User actions
    /** Processes login/register POST user data. Returns server text/html response */
    public function greetUser(): string{
        if(!$this->checkCSRFinjected()) return SettingsDispatcher::RESPONSE_WaUTH;

        $isRegistering = filter_input(INPUT_POST,'isReg',FILTER_VALIDATE_BOOL);
        $args = [
            'uname' => [
                'filter' => FILTER_VALIDATE_REGEXP,
                'options' => ['regexp' => '/^[0-9A-Za-z_-]{4,25}$/']
            ],
            'pass' => ['filter' => FILTER_DEFAULT]
        ];
        if($isRegistering) $args['email'] = ['filter' => FILTER_VALIDATE_EMAIL];
        $udata = filter_input_array(INPUT_POST,$args);

        foreach($udata as $key => $val){
            if($val === null || $val === false){
                $this->logActivity(WardenRizz::GatherData,"signup wrong $key");
                return SettingsDispatcher::RESPONSE_WuDATA;
            }
        }

        if($isRegistering) return SettingsDispatcher::RESPONSE_GrEGISTER;
        else return SettingsDispatcher::RESPONSE_GlOGIN;
    }

    /** Hashes password using options from data/cnf.ini */
    public function protectSecret(string $password): string{
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


        // Injections
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

    public function getMGWorldInjection(): string|bool{
        if($this->config['session-name-variator'] == 1) return session_name();
        else return false;
    }

    private function getSessionUser(): array|bool{
        $user = SessionManager::user();
        if(empty($user)) return false;
        if(time() - $user['t'] > $this->config['user-expire']){
            SessionManager::user(-1);   //unset
            return false;
        }
        return $user;
    }
    public function getUTokenInjection(): string|bool{
        $user = $this->getSessionUser();
        if($user === false) return false;
        $uToken = $this->makeUToken();
        $user['token'] = $uToken;
        SessionManager::user(null,$uToken);
        return $uToken;
    }
    public function checkUTokenInjected(): bool{
        $user = $this->getSessionUser();
        if($user === false) return false;
        $uToken = filter_input(INPUT_POST,'utoken',FILTER_DEFAULT);
        if(!isset($uToken)){
            return false;
        }
        if($uToken === false){
            return false;
        }
        // timing-safe comparison
        $res = hash_equals($user['token'],$uToken);
        if(!$res){
            $this->logActivity(WardenRizz::Session,'wrong uToken');
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