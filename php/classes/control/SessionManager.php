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

    public static function regenerateId(int $expire){
        if(empty($expire)) $expire = 0;
        $t = time();
        if(($t - $_SESSION['updated'] ?? 0) > $expire){
            session_regenerate_id(true);    //deletes old session
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
}
?>