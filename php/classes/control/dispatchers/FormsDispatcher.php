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


class FormsDispatcher extends Dispatcher {
    public function View(){
        header('Content-Type:application/json');
        $data = $this->block('forms');
        $data['content']['title'] = 'Forms';
        
        $w = new Warden();
        $data['content']['mainBody'] = str_replace('$CSRF$',$w->getCSRFinjection(), $data['content']['mainBody']);
        echo json_encode($data);
    }

    public function Post(){
        header('Content-Type:text/html');
        $w = new Warden();
        if($w->checkCSRFinjected()) echo self::RESPONSE_GOOD;
        else echo self::RESPONSE_WaUTH;
    }
}
?>