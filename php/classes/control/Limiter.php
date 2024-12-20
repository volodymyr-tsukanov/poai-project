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


class Limiter {
    private int $capacity;
    private float $refillRate;
    private int $timeWindow;
    private int $penalty;
    private Warden $w;


    function __construct(Warden &$w){
        $this->w = $w;
        $rl_params = $this->w->getRLparams();
        if($rl_params === false) throw new Errorr($this,ErrorCause::RateLimiter,'no ini');

        $this->capacity = $rl_params['capacity'] ?? 10;
        $this->refillRate = $rl_params['refil-rate'] ?? 0.25;
        $this->timeWindow = $rl_params['time-window'] ?? 60;
        $this->penalty = $rl_params['penalty'] ?? -10;
    }


    private function isValidState(?array $state): bool{
        if(!is_array($state))
            return false;
        if(!isset($state['tokens']) || !isset($state['refilled']) || !isset($state['updated']) || !isset($state['penalties']))
            return false;
        if(!is_int($state['tokens']) || !is_int($state['refilled']) || !is_int($state['updated']) || !is_int($state['updated']))
            return false;
        if($state['tokens'] > $this->capacity){
            $this->w->logShared($this,"having more tokens");
            return false;
        }
        if($state['refilled'] > time()+60){
            $this->w->logShared($this,"state->refilled from future");
            return false;
        }
        return true;
    }
    private function getDefaultState(): array{
        return [
            'tokens' => $this->capacity,
            'refilled' => time(),
            'updated' => time(),
            'penalties' => 0
        ];
    }


    private function readBucketState(): array{
        $state = $_SESSION['limiter'];
        if(!$this->isValidState($state)){
            $this->w->logShared($this,"Invalid state found, resetting to default");
            return $this->getDefaultState();
        }
        return $state;
    }
    private function writeBucketState(array $state){
        $_SESSION['limiter'] = $state;
    }


    public function checkLimit(): bool{
        try{
            $state = $this->readBucketState();
            $t = time();
            
            // Reset tokens if time window has passed
            if(($t - $state['refilled']) > $this->timeWindow){
                $state = $this->getDefaultState();
            } else{
                // Calculate tokens to add within the current window
                $past = $t - $state['updated'];
                $tokensToAdd = (int)floor($past * $this->refillRate);
                
                $state['tokens'] = min($state['tokens']+$tokensToAdd, $this->capacity);
            }

            $state['updated'] = $t;

            if($state['tokens'] > $this->penalty){
                $state['tokens']--;
            } else{ //TODO ban by IP
                $this->w->logShared($this,'scraper!');
                sleep(5);
            }
            $this->writeBucketState($state);
            return $state['tokens'] > 0;
        } catch(Errorr $e){
            $this->w->logShared($this,$e);
            return false;
        }
    }

    public function getRemainingTokens(): int{
        try{
            $state = $this->readBucketState();
            return max(0,$state['tokens']);
        } catch(Errorr $e){
            $this->w->logShared($this,$e);
            return $this->capacity;
        }
    }
}
?>