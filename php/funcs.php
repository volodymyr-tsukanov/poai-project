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
// Constants



// Debug
function setDebugMode($mode){
    if($mode == 1){
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    } else {
        error_reporting(0);
        ini_set('display_errors', 0);
    }
}


// Basic
function redirect($location){
    header("location:$location");
    exit;
}

function getJsonBody(): array{
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData,true);
    return $data;
}


// Data formatting
function minifyHTML(string $html): string{
    // Remove comments
    $html = preg_replace('/<!--.*?-->/s', '', $html);
    // Remove spaces, tabs, newlines
    $html = preg_replace('/\s+/s', ' ', $html);
    // Remove spaces between tags
    $html = preg_replace('/>\s+</', '><', $html);
    // Trim leading and trailing spaces
    $html = trim($html);
    return $html;
}
function minifyCSS(string $css): string {
    // Remove comments
    $css = preg_replace('/\/\*.*?\*\//s', '', $css);
    // Remove extra spaces, tabs, and newlines
    $css = preg_replace('/\s+/s', ' ', $css);
    // Remove spaces between selectors and rules
    $css = preg_replace('/\s*([{}:;,])\s*/', '$1', $css);
    // Remove trailing spaces before semicolons
    $css = preg_replace('/;}/', '}', $css);
    // Trim leading and trailing spaces
    $css = trim($css);
    return $css;
}
function minifyJS(string $js): string {
    // Remove comments
    $js = preg_replace('/\/\*.*?\*\//s', '', $js);  // block comments
    //$js = preg_replace('/\/\/.*?[\r\n]/', '', $js); // line comments
    // Remove extra spaces and newlines
    $js = preg_replace('/\s+/s', ' ', $js);
    // Remove spaces between operators and semicolons
    //$js = preg_replace('/\s*([{}();,+\-*/%&|^!?:=<>,])\s*/', '$1', $js);
    // Remove leading and trailing spaces
    $js = trim($js);
    return $js;
}


// Special
function touchWord(string &$virgin){
    for($u=0; $u<strlen($virgin); $u++){
        $chance = random_int(0,100);
        if($chance > 70){   //30%
            $virgin[$u] = strtolower($virgin[$u]);
        } else if($chance > 45){    //25%
            switch($virgin[$u]){
                case 'O':
                    $virgin[$u] = '0';
                    break;
                case 'B':
                    $virgin[$u] = 'G';
                    break;
                case 'I':
                    $virgin[$u] = 'l';
                    break;
                case 'J':
                    $virgin[$u] = 'I';
                    break;
                case 'Q':
                    $virgin[$u] = 'O';
                    break;
                case 'V':
                    $virgin[$u] = 'W';
                    break;
                case 'R':
                    $virgin[$u] = 'J';
                    break;
                case 'T':
                    $virgin[$u] = 'N';
                    break;
            }
        }   //skip 45%
    }
}
function makeMagicWord(array $magicPower, int $amount=2, bool $isVariated=true): string{
    if(empty($magicPower)) $magicPower = ['DRAGON','POWDER','BUSSIN','IGOR','NUGGET','COOK','CROOK'];
    if(count($magicPower) < $amount || $amount < 1) $amount = count($magicPower);
    $res = '';
    shuffle($magicPower);
    for($i=0; $i<$amount; $i++){
        if($isVariated) touchWord($magicPower[$i]);
        $res .= $magicPower[$i];
    }
    return $res;
}
?>
