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

use stdClass;
use mysqli;
use project_VT\control\Dispatcher;
use project_VT\control\ErrorCause;
use project_VT\control\Errorr;
use project_VT\control\Warden;


class DTBase {
    private static ?DTBase $instance = null;
    private const PARAMS_DEFAULT = [
        'hostname'=>'localhost',
        'username'=>'root',
        'password'=>''
    ];

    private mysqli $mysqli;
    private Warden $w;


    protected function __construct(bool $connect=false){
        $this->w = Warden::getInstance();
        self::$instance = $this;
        if($connect) $this->connect();
    }
    function __destruct(){
        if(isset($this->mysqli)){
            $this->mysqli->close();
            unset($this->mysqli);
            self::$instance = null;
        }
    }

    public static function getInstance(): DTBase{
        if(self::$instance === null) self::$instance = new DTBase();
        return self::$instance;
    }


    private function connect(){
        $db_params = $this->w->getDBparams();
        if($db_params === false) throw new Errorr($this,ErrorCause::DB,'no ini');

        $this->mysqli = new mysqli($db_params['hostname'],$db_params['username'],$db_params['password'],$db_params['database']);
        //test connection
        if($this->mysqli->connect_errno){
            $this->mysqli = new mysqli(self::PARAMS_DEFAULT['hostname'],self::PARAMS_DEFAULT['username'],self::PARAMS_DEFAULT['password'], $db_params['database']);   //try with default params
            if($errn = $this->mysqli->connect_errno){
                throw new Errorr($this,ErrorCause::DB,$errn);
            }
        }
        //set encoding
        if(!$this->mysqli->set_charset($db_params['charset'])){
            throw new Errorr($this,ErrorCause::DB,'set charset');
        }
    }


    public function isEnabled(): bool{
        return isset($this->mysqli);
    }
    /** Connect to db */
    public function enable(){
        if(!$this->isEnabled()) $this->connect();
    }

    /** Returns naughtyList entry as array if ip in range */
    public function selectNaughtyList($ip): array|null{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'sNL:not enabled');
        $stmt = $this->mysqli->prepare('SELECT `id`,`ip_start`,`ip_end`,`abd` FROM `naughtyList` WHERE `ip_start` <= ? AND `ip_end` >= ?');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'sNL:failed prepare');
        $stmt->bind_param('bb', $ip,$ip);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sNL:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sNL:failed stmt result');
        }
        $arr = $result->fetch_assoc();
        $result->free();
        $stmt->close();
        if($arr === false) throw new Errorr($this,ErrorCause::DB,'sNL:failed stmt result->fetch');
        return $arr;
    }
    /** TODO */
    public function selectNaughtyListAll(): array{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT * FROM `naughtyList`");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'sNLa:failed prepare');
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sNLa:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sNLa:failed stmt result');
        }
        $nList = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        $stmt->close();
        return $nList;
    }
    /** Inserts new entry to naughtyList
     * $ipData - array with fields: (bin)ip, (int)reason, (string)abd
     */
    public function insertNaughtyList(array $ipData){
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'iNL:not enabled');
        $stmt = $this->mysqli->prepare('INSERT INTO `naughtyList`(`ip_start`,`ip_end`,`reason`,`abd`) VALUES (?,?,?,?)');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'iNL:failed prepare');
        $stmt->bind_param('bbis', $ipData['ip'],$ipData['ip'],$ipData['reason'],$ipData['abd']);
        $result = $stmt->execute();
        $stmt->close();
        if($result === false) throw new Errorr($this,ErrorCause::DB,'iNL:failed stmt execute');
    }
    /** TODO */
    public function deleteNaughtyList(int $id){
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'iNL:not enabled');
        $stmt = $this->mysqli->prepare('DELETE FROM `naughtyList` WHERE id = ?');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'dNL:failed prepare');
        $stmt->bind_param('i', $id);
        $result = $stmt->execute();
        $stmt->close();
        if($result === false) throw new Errorr($this,ErrorCause::DB,'dNL:failed stmt execute');
    }

    /** Gets user id by username if password matches */
    public function selectUserByUsername(string $username, string $password): stdClass{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT id, pass, status FROM `users` WHERE username = ?");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'sUbU:failed prepare');
        $stmt->bind_param('s', $username);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sUbU:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sUbU:failed stmt result');
        }
        $user = $result->fetch_object();
        $result->free();
        $stmt->close();
        if($user !== null && $user !== false){
            if(!password_verify($password,$user->pass)){
                throw new Errorr($this,ErrorCause::DB, Dispatcher::RESPONSE_WpASS);
            }
        } else throw new Errorr($this,ErrorCause::DB, Dispatcher::RESPONSE_NeXIST);
        return $user;
    }
    /** Gets all user data by id if password matches */
    public function getUserById(int $id, string $password): stdClass{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT username, email, pass, status, reputation, language FROM `users` WHERE id = ?");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'gUbI:failed prepare');
        $stmt->bind_param('i', $id);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'gUbI:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'gUbI:failed stmt result');
        }
        $user = $result->fetch_object();
        $result->free();
        $stmt->close();
        if($user !== null && $user !== false){
            if(!password_verify($password,$user->pass)){
                throw new Errorr($this,ErrorCause::DB, Dispatcher::RESPONSE_WpASS);
            }
        } else throw new Errorr($this,ErrorCause::DB, Dispatcher::RESPONSE_NeXIST);
        return $user;
    }
    /** Creates new user
     * $userData - array with fields: (string)username, (string)email, (string)pass
     */
    public function insertUser(array $userData){
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'iU:not enabled');
        $stmt = $this->mysqli->prepare('INSERT INTO `users`(`username`,`email`,`pass`) VALUES (?,?,?)');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'iU:failed prepare');
        $stmt->bind_param('sss', $userData['username'],$userData['email'],$this->w->protectSecret($userData['pass']));
        $result = $stmt->execute();
        $stmt->close();
        if($result === false) throw new Errorr($this,ErrorCause::DB,'iU:failed stmt execute');
    }

    public function selectLettersBySubject(string $subject): array{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT id, status, sender, created, receiver_id FROM `letters` WHERE subject = ?");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'sLbS:failed prepare');
        $stmt->bind_param('s', $subject);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sLbS:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sLbS:failed stmt result');
        }
        $letters = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        $stmt->close();
        return $letters;
    }
    public function selectLettersByStatus(string $status): array{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT id, subject, sender, created, receiver_id FROM `letters` WHERE status = ?");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'sLbT:failed prepare');
        $stmt->bind_param('s', $status);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sLbT:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'sLbT:failed stmt result');
        }
        $letters = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        $stmt->close();
        return $letters;
    }
    /** Gets all letter data by id */
    public function getLetterById(int $id): array{
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'not enabled');
        $stmt = $this->mysqli->prepare("SELECT subject, message, status, sender, created, receiver_id FROM `letters` WHERE id = ?");
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'gLbI:failed prepare');
        $stmt->bind_param('i', $id);
        if($stmt->execute() === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'gLbI:failed stmt execute');
        }
        $result = $stmt->get_result();
        if($result === false){
            $stmt->close();
            throw new Errorr($this,ErrorCause::DB,'gLbI:failed stmt result');
        }
        $letter = $result->fetch_assoc();
        $result->free();
        $stmt->close();
        return $letter;
    }
    /** Creates new letter (contact)
     * $feedbackData - array with fields: (string)sender, (string)email, (string enum)subject, (string)message
     */
    public function insertLetter(array $feedbackData){
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'iL:not enabled');
        $stmt = $this->mysqli->prepare('INSERT INTO `letters`(`subject`,`message`,`sender`) VALUES (?,?,?)');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'iL:failed prepare');
        $stmt->bind_param('sss', $feedbackData['subject'],$feedbackData['message'],$feedbackData['sender']);
        $result = $stmt->execute();
        $stmt->close();
        if($result === false) throw new Errorr($this,ErrorCause::DB,'iL:failed stmt execute');
    }
    /** TODO */
    public function updateLetterStatus(int $id, string $status, int $userId){
        if(!$this->isEnabled()) throw new Errorr($this,ErrorCause::DB,'uLS:not enabled');
        $stmt = $this->mysqli->prepare('UPDATE `letters` SET status = ?, receiver_id = ? WHERE id = ?');
        if($stmt === false) throw new Errorr($this,ErrorCause::DB,'uLS:failed prepare');
        $stmt->bind_param('sii', $status,$userId,$id);
        $result = $stmt->execute();
        $stmt->close();
        if($result === false) throw new Errorr($this,ErrorCause::DB,'uLS:failed stmt execute');
    }
}
?>
