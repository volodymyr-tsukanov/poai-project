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
namespace project_VT\control\dispatchers;

use project_VT\control\Dispatcher;
use project_VT\control\Warden;


class MainDispatcher extends Dispatcher {
    public function Init(){
        header('Content-Type:text/html');
        $data = $this->index();
        echo $data;
    }
    
    public function View(){
        header('Content-Type:application/json');
        $data = $this->block('main');
        $data['content']['title'] = 'Project VT';
        echo json_encode($data);
    }

    public function ResGet(){
        $w = new Warden();
        
        header('Content-Type:text/html');
        $type = $w->gatherGETData('t');
        $name = $w->gatherGETData('n');
        if($type == false || $name == false)
            echo self::RESPONSE_WrEQEST;
        else{
            switch($type){
                case 'bk':  //block
                    $data = $this->blockRaw($name);
                    if($data === false) echo self::RESPONSE_NeXIST;
                    else echo $data;
                    break;
                default:
                    echo self::RESPONSE_NeXIST;
                    break;
            }
        }
    }
}
?>