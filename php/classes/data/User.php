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
namespace project_VT\data;

use stdClass;
use DateTime;
use project_VT\control\Warden;


enum UserStatus: int {
    case Shepherd = 1;
}
enum UserLanguage: int{
    case English = 0;
    case Polish = 48;
    case Ukranian = 38;
}


class User {
    public const REPUTATION_DEFAULT = 20;

    protected string $username;
    protected string $email;
    private string $passwd;
    protected int $reputation;
    protected DateTime $updated;
    protected UserStatus $status;
    protected UserLanguage $language;


    function __construct(string $username, string $email, string $passwd, UserLanguage $language=UserLanguage::English){
        $this->username = $username;
        $this->email = $email;
        $this->passwd = $passwd;
        $this->reputation = self::REPUTATION_DEFAULT;
        $this->updated = new DateTime('now');
        $this->status = UserStatus::Shepherd;
        $this->language = $language;
    }
    function __destruct(){
        unset($this->passwd);
        unset($this->date);
    }

    public static function fromStdClass(stdClass $object, string $passwd): User{
        return new self($object->username, $object->email, $passwd, $object->language);
    }
    public static function fromJson(string $jsonData): User{
        $json = json_decode($jsonData);
        return new self($json->username, $json->email, $json->passwd, $json->language);
    }


    public function getUsername() : string{
        return $this->username;
    }

    public function getEmail() : string{
        return $this->email;
    }
    public function setEmail($email){
        $this->email = $email;
    }

    public function getPasswd() : string{
        return $this->passwd;
    }
    public function setPasswd($passwd){
        $this->passwd = $passwd;
    }

    public function getUpdated(): DateTime{
        return $this->updated;
    }
    public function setUpdated(DateTime $date){
        $this->updated = $date;
    }

    public function getStatus(): UserStatus{
        return $this->status;
    }


    public function show(){
        printf('User: %s %s status=%d %s', $this->username,$this->email,$this->status,Warden::packTime($this->updated));
    }

    public function toArray(): array {
        return [
            "username" => $this->username,
            "email" => $this->email,
            "passwd" => $this->passwd,
            "updated" => Warden::packTime($this->updated),
            "status" => (int)$this->status,
            "language" => (int)$this->language
        ];
    }
    public function toJSON(): string{
        return json_encode($this->toArray());
    }
}
?>
