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
namespace project_VT\control;

use project_VT\control\dispatchers\MainDispatcher;
use project_VT\control\Errorr;
use project_VT\control\Warden;


enum RouterAction {
    case View;
}


class Router {
    protected $routes = [];
    private Warden $w;


    function __construct(){
        $this->w = new Warden();

        // Main
        $this->addRoute('/', MainDispatcher::class,RouterAction::View,'GET');
        $this->addRoute('/index.php', MainDispatcher::class,RouterAction::View,'GET');
        $this->addRoute('/pub/', MainDispatcher::class,RouterAction::View,'GET');
        
        //!DEBUG ONLY
        $this->addRoute('/php/poai-project/php/pub/', MainDispatcher::class,RouterAction::View,'GET');
    }


    private function addRoute(string $route, $dispatcher, RouterAction $action, string $method){
        $this->routes[$method][$route] = ['controller' => $dispatcher, 'action' => $action];
    }


    public function dispatch(){
        $req = $this->w->dispatch();

        if(array_key_exists($req['uri'], $this->routes[$req['method']])){
            $dispatcherClass = $this->routes[$req['method']][$req['uri']]['controller'];
            $methodName = $this->routes[$req['method']][$req['uri']]['action']->name;
            
            $dispatcher = new $dispatcherClass();
            if(method_exists($dispatcher, $methodName)){
                $dispatcher->$methodName();
            } else {
                echo "Action $methodName does not supported in $dispatcherClass.";
            }
        } else {
            $uri = $req['uri'];
            throw new Errorr($this,ErrorCause::Routing,"not found URI: $uri");
        }
    }
}
?>