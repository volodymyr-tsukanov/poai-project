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


class SessionManager {
    private static function getCleanSession(): array{
        $cSession = [];
        if(isset($_SESSION['user'])){
            $cSession['user'] = [
                'id'=>$_SESSION['user']['id'],
                'status'=>$_SESSION['user']['status'],
                't'=>$_SESSION['user']['t']
            ];
        }
        if(isset($_SESSION['UA'])) $cSession['UA'] = $_SESSION['UA'];
        if(isset($_SESSION['limiter'])) $cSession['limiter'] = $_SESSION['limiter'];
        return $cSession;
    }

    public static function start(string $name){
        session_name($name);
        session_start();
    }
    public static function switch(string $name){
        session_write_close();
        self::start($name);
    }
    public static function destroy(){
        if(isset($_COOKIE[session_name()])){    //spoil cookie
            setcookie(session_name(), '', time()-3600, '/');
        }
        session_unset();    //cleanup
        session_destroy();
    }
    public static function sign(){
        $_SESSION['v'] = '0.1';
    }
    public static function isSigned(): bool{
        if(session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['v'])) return true;
        return false;
    }

    public static function regenerateId(int $expire){
        if(empty($expire)) $expire = 0;
        $t = time();
        if(($t - $_SESSION['updated'] ?? 0) > $expire){
            $cSession = self::getCleanSession();
            session_regenerate_id(true);    //deletes old session
            $_SESSION = $cSession;
            $_SESSION['updated'] = $t;
        }
    }

    public static function userAgent(?string $val=null): ?string{
        $oldVal = $_SESSION['UA'];
        if(!empty($val)){
            $_SESSION['UA'] = $val;
        }
        return $oldVal;
    }
    /** One time read */
    public static function CSRF(string $name='csrf', ?string $token=null): ?array{
        $oldVal = $_SESSION['CSRF'];
        if(empty($token)){
            unset($_SESSION['CSRF']);   //one time read
        } else{
            $_SESSION['CSRF'] = [
                'name'=>$name,
                'token'=>$token,
                'time'=>time()
            ];
        }
        return $oldVal;
    }
    /** put no params to get. to set put $prms['id'] and 'status'. to unset put -1 as $prms['id'], $prms['token] = uToken. returns oldVal */
    public static function user(?array $prms=null): ?array{
        $oldVal = $_SESSION['user'];
        if(isset($prms['id'])){
            if($prms['id'] === -1){
                unset($_SESSION['user']);
                return $oldVal;
            }
            else $_SESSION['user'] = [
                    'id'=>$prms['id'],
                    'status'=>$prms['status'],
                    't'=>time()
                ];
        }
        if(isset($prms['token'])) $_SESSION['user']['token'] = $prms['token'];
        if(isset($prms['cpanel'])) $_SESSION['user']['cpanel'] = $prms['cpanel'];
        return $oldVal;
    }
}
?>