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
    private string $storageFile;
    private $fileHandle;
    private Warden $w;


    function __construct(Warden &$w){
        $this->w = $w;
        $rl_params = $this->w->getRLparams();
        if($rl_params === false) throw new Errorr($this,ErrorCause::RateLimiter,'no ini');

        $this->capacity = $rl_params['capacity'] ?? 10;
        $this->refillRate = $rl_params['refil-rate'] ?? 1;
        $this->timeWindow = $rl_params['time-window'] ?? 60;
        $this->storageFile = $rl_params['file-storage'] ?? '../data/limiter.dat';

        $data = file_get_contents($this->storageFile);
        if($data === false || $data === ''){
            try{
                $this->acquireLock();
                $this->writeBucketState($this->getDefaultState());
            } catch(Errorr $e){
                $this->w->logShared($this,$e);
                return false;
            } finally{
                $this->releaseLock();
            }
        }
    }
    public function __destruct(){
        $this->releaseLock();
    }


    private function acquireLock(){
        $this->fileHandle = fopen($this->storageFile, 'c+');
        if(!$this->fileHandle || !flock($this->fileHandle, LOCK_EX))
            throw new Errorr($this,ErrorCause::RateLimiter,"Cannot acquire lock");
    }
    private function releaseLock(){
        if($this->fileHandle){
            flock($this->fileHandle, LOCK_UN);
            fclose($this->fileHandle);
            $this->fileHandle = null;
        }
    }

    private function isValidState($state): bool{
        if(!is_array($state))
            return false;
        if(!isset($state['tokens']) || !isset($state['refilled']) || !isset($state['updated']))
            return false;
        if(!is_int($state['tokens']) || !is_int($state['refilled']) || !is_int($state['updated']))
            return false;
        if($state['tokens'] < 0 || $state['tokens'] > $this->capacity)
            return false;
        if($state['refilled'] > time()+60)
            return false;
        return true;
    }
    private function getDefaultState(): array{
        return [
            'tokens' => $this->capacity,
            'refilled' => time(),
            'updated' => time()
        ];
    }


    private function readBucketState(): array{
        $data = fread($this->fileHandle, filesize($this->storageFile) ?: 1024);
        if($data === false)
            throw new Errorr($this,ErrorCause::RateLimiter,"Failed to read storage file");

        $state = json_decode($data, true);
        if(json_last_error() !== JSON_ERROR_NONE)
            throw new Errorr($this,ErrorCause::RateLimiter,"Invalid JSON in storage file");

        if(!$this->isValidState($state)){
            $this->w->logShared($this,"Invalid state found, resetting to default");
            return $this->getDefaultState();
        }
        return $state;
    }
    private function writeBucketState(array $state){
        if(!$this->isValidState($state))
            throw new Errorr($this,ErrorCause::RateLimiter,"Attempting to write invalid state");

        // Reset file pointer and truncate
        ftruncate($this->fileHandle, 0);
        rewind($this->fileHandle);

        // Write new state
        $json = json_encode($state, JSON_PRETTY_PRINT); //!DEBUG
        if(fwrite($this->fileHandle, $json) === false)
            throw new Errorr($this,ErrorCause::RateLimiter,"Failed to write state");

        fflush($this->fileHandle);
    }


    /** Call in Route->__construct */
    public function checkLimit(): bool{
        try{
            $this->acquireLock();
            
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

            if($state['tokens'] > 0){
                $state['tokens']--;
                $this->writeBucketState($state);
                return true;
            }
            return false;
        } catch(Errorr $e){
            $this->w->logShared($this,$e);
            return false;
        } finally{
            $this->releaseLock();
        }
    }

    public function getRemainingTokens(): int{
        try{
            $this->acquireLock();
            $state = $this->readBucketState();
            return max(0, $state['tokens']);
        } catch (Errorr $e){
            $this->w->logShared($this,$e);
            return $this->capacity;
        } finally{
            $this->releaseLock();
        }
    }
}
?>