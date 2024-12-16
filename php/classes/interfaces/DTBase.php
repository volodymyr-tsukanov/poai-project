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
namespace project_VT\interfaces;

use mysqli;
use project_VT\control\ErrorCause;
use project_VT\control\Errorr;
use project_VT\control\Warden;


class DTBase {
    private const PARAMS = ['server'=>'localhost','user'=>'root','pass'=>''];

    private mysqli $mysqli;


    public function __construct(string $server, string $user, string $pass, string $db_name){
        $this->mysqli = new mysqli($server, $user, $pass, $db_name);
        //test connection
        if($this->mysqli->connect_errno){
            $this->mysqli = new mysqli(self::PARAMS['server'],self::PARAMS['user'],self::PARAMS['pass'], $db_name);   //try with default params
            if($errn = $this->mysqli->connect_errno){
                throw new Errorr($this,ErrorCause::DB,$errn);
            }
        }
        //set utf8 encoding
        if(!$this->mysqli->set_charset("utf8")){
            throw new Errorr($this,ErrorCause::DB,'set utf8');
        }
    }
    function __destruct(){
        if(isset($this->mysqli)){
            $this->mysqli->close();
            unset($this->mysqli);
        }
    }


    public function insertUser(array $userData){
        $stmt = $this->mysqli->prepare("INSERT INTO `users`(username,email,passwd,reputation,language) VALUES (?,?,?,?,?)");
        $stmt->bind_param('sssii', $userData['username'], $userData['email'], Warden::protectPasswd($userData['passwd']), $userData['reputation'], $userData['language']);
        $res = $stmt->execute();
        $stmt->close();
    }

    protected function selectUser(string $username, string $password){

    }
    protected function deleteUser(string $username, string $password){
        $stmt = $this->mysqli->prepare("SELECT passwd FROM `users` WHERE username = ?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($user = $result->fetch_assoc()){
            if(password_verify($password,$user['passwd'])){

            }
        } else {
            echo "No user found.";
        }
        $stmt->close();
    }
}
?>