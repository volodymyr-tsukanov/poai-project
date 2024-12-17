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


class SettingsDispatcher extends Dispatcher {
    public function View(){
        header('Content-Type:application/json');
        $name = 'settings';
        $content = explode('$SEP$',AssetManager::getHTMLBlock($name));
        $response = [
            'status' => "success",
            'name' => $name,
            'v' => "0.1",
            'content' => [
                'title' => "Project VT",
                'header' => $content[0],
                'mainBody' => $content[1]
            ]
        ];
        echo json_encode($response);
    }
}
?>