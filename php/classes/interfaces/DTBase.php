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


class DTBase
{
    private const PARAMS = ['server'=>'localhost','user'=>'root','pass'=>''];

    private mysqli $mysqli;


    public function __construct(string $server, string $user, string $pass, string $db_name) {
        $this->mysqli = new mysqli($server, $user, $pass, $db_name);
        //test connection
        if ($this->mysqli->connect_errno){
            $this->mysqli = new mysqli(self::PARAMS['server'],self::PARAMS['user'],self::PARAMS['pass'], $db_name);   //try with default params
            if ($this->mysqli->connect_errno){
                printf("Server connection error: %s\n", $this->mysqli->connect_error);
                exit();
            }
        }
        //set utf8 encoding
        if ($this->mysqli->set_charset("utf8")){
        }
    }
    function __destruct(){
        //debug_print_backtrace();
        if(isset($this->mysqli)){
            $this->mysqli->close();
            unset($this->mysqli);
        }
    }


    protected function insert(string $table, string $values): bool{
        $stmt = $this->mysqli->prepare("INSERT INTO ? VALUES (?)");
        $stmt->bind_param('ss', $table, $values);
        return $stmt->execute();
    }

    protected function delete(string $table, string $where): bool{
        $stmt = $this->mysqli->prepare("DELETE FROM ? WHERE ?");
        $stmt->bind_param('ss', $table, $where);
        return $stmt->execute();
    }

    public function select(string $table, string $what, string $where): stdClass|null{
        $response = $this->mysqli->query("SELECT $what FROM $table WHERE $where");
        $res = null;
        if($response->num_rows > 0){
            $res = $response->fetch_object();
        }
        $response->close();
        return $res;
    }
    public function selectUser(string $userName, string $passwd): stdClass|null{
        $passHash = hash('sha256',$passwd);
        return $this->select('users','id,userName,fullName,email,date',"userName='$userName' AND passwd='$passHash'");
    }
    public function selectUserById(int $userId): stdClass|null{
        return $this->select('users','userName,fullName,email,passwd,date',"id=$userId");
    }
    public function selectAll($sql, $pola) {
        //parametr $sql – łańcuch zapytania select
        //parametr $pola - tablica z nazwami pol w bazie
        //Wynik funkcji – kod HTML tabeli z rekordami (String)
        $tresc = "";
        $result = $this->mysqli->query($sql);
        if ($result->num_rows > 0) {
            $ilepol = count($pola); //ile pól
            // pętla po wyniku zapytania $results
            $tresc.="<table><tbody>";
            while ($row = $result->fetch_object()) {
                $tresc.="<tr>";
                for ($i = 0; $i < $ilepol; $i++) {
                    $p = $pola[$i];
                    $tresc.="<td>" . $row->$p . "</td>";
                }
                $tresc.="</tr>";
            }
            $tresc.="</tbody></table>";
            $result->close(); // zwolnij pamięć
        }
        return $tresc;
    }
}
?>