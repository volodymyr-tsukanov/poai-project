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


// Session
function sessionDestroy(){
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    session_destroy();
    session_unset();
    $_SESSION = array();
}

function redirect($location){
    header("location:$location");
    exit;
}
?>
