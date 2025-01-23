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

use DateTime;
use stdClass;


enum LetterStatus: int{
    case New = 1;
    case Read = 11;
    case Answered = 111;
    case Important = 122;
}
enum LetterSubject: string{
    case ThisSite = 'project-VT';
    case nspec = 'nspec';
}


class Letter {
    private int $id;
    protected int $receiverId;
    protected string $message;
    protected DateTime $created;
    protected LetterStatus $status;
    protected LetterSubject $subject;


    function __construct(int $id, string $message, DateTime $created, LetterStatus $status, LetterSubject $subject = LetterSubject::nspec, int $receiverId = -1){
        $this->id = $id;
        $this->message = $message;
        $this->created = $created;
        $this->status = $status;
        $this->subject = $subject;
        if($receiverId>=0) $this->receiverId = $receiverId;
    }
    function __destruct(){
        unset($this->date);
    }

    public static function fromStdClass(stdClass $object): Letter{
        return new self($object->id, $object->message, $object->created, $object->status, $object->subject, $object->receiver_id);
    }
    public static function fromJson(string $jsonData): Letter{
        $json = json_decode($jsonData);
        return new self($json->username, $json->email, $json->passwd, $json->language);
    }

    public function getId(): int{
        return $this->id;
    }
    public function getMessage(): string{
        return $this->message;
    }
    public function setMessage(string $message){
        $this->message = $message;
    }

    public function getCreated(): DateTime{
        return $this->created;
    }
    public function setCreated(DateTime $created){
        $this->created = $created;
    }

    public function getStatus(): LetterStatus{
        return $this->status;
    }
    public function setStatus(LetterStatus $status){
        $this->status = $status;
    }

    public function getSubject(): LetterSubject{
        return $this->subject;
    }
    public function setSubject(LetterSubject $subject){
        $this->subject = $subject;
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