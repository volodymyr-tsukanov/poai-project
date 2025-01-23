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
use project_VT\control\AssetManager;
use project_VT\control\Errorr;
use project_VT\control\SessionManager;
use project_VT\interfaces\DTBase;

class CPanelDispatcher extends Dispatcher { //TODO uToken + CSRF when signed in
    public function Init(){
        header('Content-Type:text/html');
        $data = explode('$SEP$',AssetManager::getHTMLBlock('cpanel'));
        $data[0] = str_replace(['$CSS$','$JS$'],[AssetManager::getCSSContent('signup-form'),AssetManager::getJSContent('classes').AssetManager::getJSContent('control')], $data[0]);

        $uToken = $this->w->getUTokenInjection();
        if($uToken !== false){  //signed in
            $data[1] = str_replace('*UTOKEN*',$uToken, $data[1]);
            //$data[1] = str_replace('*CSRF*',$this->w->getCSRFinjection(), $data[1]);
            $data[0] = str_replace('$BOD$',$data[1], $data[0]);
        } else{
            $block = str_replace('*CSRF*',$this->w->getCSRFinjection(), $this->htmlRaw('signup-form'));
            $data[0] = str_replace('$BOD$',$block, $data[0]);
        }

        echo $data[0];
    }

    public function Post(){
        header('Content-Type:text/html');
        $output = self::RESPONSE_BAD;
        $data = getJsonBody();
        $action = filter_var($data['act'],FILTER_DEFAULT);
        if($action === null || $action === false) return self::RESPONSE_WrEQEST;
        $db = DTBase::getInstance();
        switch($action){
            case 'Lin': //login
                $output = $this->w->greetUser($data);
                break;
            case 'Lout':    //logout
                if($this->w->checkUTokenInjected()){
                    SessionManager::user(['id'=>-1]);   //unset
                    $output = self::RESPONSE_GOOD;
                } else{
                    $output = self::RESPONSE_WaUTH;
                }
                break;
            case 'GltrI':    //get letter by id
                break;
            case 'GltrS':   //get letters by subject
                if($this->w->checkUTokenInjected()){
                    $subject = filter_var($data['subject'], FILTER_DEFAULT);
                    if($subject === null || $subject === false || !in_array($subject, ['project-VT','pear','telephone-book','sw-c','code-crypt','nspec'])){
                       echo self::RESPONSE_WdATA;
                       return;
                    }
                    header('Content-Type:application/json');
                    try{
                        $db->enable();
                        $letters = $db->selectLettersBySubject($subject);
                        if(empty($letters)) echo Dispatcher::RESPONSE_NeXIST;
                        else echo json_encode($letters);
                    } catch(Errorr $e){ //TODO normal error handling
                        echo $e->getDescription();
                    }
                    return;
                } else{ //TODO logActivity
                    $output = self::RESPONSE_WaUTH;
                }
                break;
            default:
                $output = self::RESPONSE_NeXIST;
                break;
        }
        echo $output;
    }
}
?>