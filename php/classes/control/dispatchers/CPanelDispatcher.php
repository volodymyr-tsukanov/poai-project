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

    public function Post(){ //TODO fix $output and return ; cleanup code
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
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
                SessionManager::user(['id'=>-1]);   //unset
                $output = self::RESPONSE_GOOD;
                break;
            case 'GltrI':    //get letter by id
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
                $letterId = filter_var($data['id'], FILTER_VALIDATE_INT);
                if($letterId === null || $letterId === false){
                    echo self::RESPONSE_WdATA;
                    return;
                }
                header('Content-Type:application/json');
                try{
                    $db->enable();
                    $letter = $db->getLetterById($letterId);
                    if(empty($letter)) echo Dispatcher::RESPONSE_NeXIST;
                    else{
                        if($letter['status'] === 'new') $db->updateLetterStatus($letterId,'read',SessionManager::user()['id']);
                        echo json_encode($letter);
                    }
                } catch(Errorr $e){ //TODO normal error handling
                    echo $e->getDescription();
                }
                return;
            case 'GltrS':   //get letters by subject
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
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
            case 'GltrT':   //get letters by status
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
                $status = filter_var($data['status'], FILTER_DEFAULT);
                if($status === null || $status === false || !in_array($status, ['new','read','answered','important'])){
                    echo self::RESPONSE_WdATA;
                    return;
                }
                header('Content-Type:application/json');
                try{
                    $db->enable();
                    $letters = $db->selectLettersByStatus($status);
                    if(empty($letters)) echo Dispatcher::RESPONSE_NeXIST;
                    else echo json_encode($letters);
                } catch(Errorr $e){ //TODO normal error handling
                    echo $e->getDescription();
                }
                return;
            case 'UltrS':    //update letter status
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
                $letterId = filter_var($data['id'], FILTER_VALIDATE_INT);
                if($letterId === null || $letterId === false){
                    echo self::RESPONSE_WdATA;
                    return;
                }
                $status = filter_var($data['status'], FILTER_DEFAULT);
                if($status === null || $status === false || !in_array($status, ['new','read','answered','important'])){
                    echo self::RESPONSE_WdATA;
                    return;
                }
                try{
                    $db->enable();
                    $db->updateLetterStatus($letterId,$status,SessionManager::user()['id']);
                    echo Dispatcher::RESPONSE_GOOD;
                } catch(Errorr $e){ //TODO normal error handling
                    echo $e->getDescription();
                }
                return;
            case 'GnlS':    //get naughty list
                if(!$this->w->checkUTokenInjected()){   //TODO log
                    echo self::RESPONSE_WaUTH;
                    return;
                }
                header('Content-Type:application/json');
                try{
                    $db->enable();
                    $nList = $db->selectNaughtyListAll();
                    if(empty($nList)) echo Dispatcher::RESPONSE_NeXIST;
                    else echo json_encode($nList);
                } catch(Errorr $e){ //TODO normal error handling
                    echo $e->getDescription();
                }
                return;
            case 'DnlI':    //delete naughty list by id
                $naughtyId = filter_var($data['id'], FILTER_VALIDATE_INT);
                if($naughtyId === null || $naughtyId === false){
                    echo self::RESPONSE_WdATA;
                    return;
                }
                try{
                    $db->enable();
                    $db->deleteNaughtyList($naughtyId);
                    echo Dispatcher::RESPONSE_GOOD;
                } catch(Errorr $e){ //TODO normal error handling
                    echo $e->getDescription();
                }
                return;
            default:
                $output = self::RESPONSE_NeXIST;
                break;
        }
        echo $output;
    }
}
?>