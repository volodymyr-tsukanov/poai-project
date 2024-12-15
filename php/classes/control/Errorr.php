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

use Exception;


enum ErrorCause {
    case UNDEFINED;
    case Routing;
    case Resource;
    case FileOperation;
}

class Errorr extends Exception {
    const DESCRIPTION_DEFAULT = 'NO DESCRIPTION';

    private $caller;
    protected ErrorCause $cause;
    protected string $description;


    function __construct($caller, ErrorCause $cause, ?string $description){
        $this->caller = $caller;
        $this->cause = $cause;
        if(isset($description)) $this->description = $description;
        else $this->description = self::DESCRIPTION_DEFAULT;
    }

    function __toString(){
        $separator = ';';
        return $this->caller::class . $separator .
            $this->cause->name . $separator .
            $this->description;
    }


    public function getCause(): ErrorCause{
        return $this->cause;
    }
}

class ErrorHandler {
    static int $HandleMode = 1; //1 = debug, 11 = dev

    public static function handleError(Errorr $err){
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
}
?>