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
namespace project_VT;

require_once '../autoloader.php';
include_once '../funcs.php';

use project_VT\control\Router;
use project_VT\control\Errorr;
use project_VT\control\ErrorCause;


setDebugMode(1);
session_start();

$router = new Router();

try{
    $router->dispatch();
} catch(Errorr $err){
    switch($err->getCause()){
        case ErrorCause::Routing:
            echo "router shits";
            break;
        case ErrorCause::FileOperation:
            echo "shit file";
            break;
        case ErrorCause::UNDEFINED:
            echo "unknown shit";
            break;
    }
}
?>