/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

import { TurboModuleRegistry } from 'react-native';

var ReactNative = require('react-native');
var RNSound = TurboModuleRegistry?TurboModuleRegistry.get('RNCSound'): ReactNative.NativeModules.RNSound;
var IsAndroid = RNSound.IsAndroid;
var IsWindows = RNSound.IsWindows;
var resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");
var eventEmitter = new ReactNative.NativeEventEmitter(RNSound);

var nextKey = 0;

function isRelativePath(path) {
  return !/^(\/|http(s?)|asset|file)/.test(path);
}

function calculateRelativeVolume(volume, pan) {
  // calculates a lower volume relative to the pan value
  const relativeVolume = (volume * (1 - Math.abs(pan)));
  return Number(relativeVolume.toFixed(1));
}

function setAndroidVolumes(sound) {
  // calculates the volumes for left and right channels
  if (sound._pan) {
    const relativeVolume = calculateRelativeVolume(sound._volume, sound._pan);
    if (sound._pan < 0) {
      // left is louder
      RNSound.setVolume(sound._key, sound._volume, relativeVolume);
    } else {
      // right is louder
      RNSound.setVolume(sound._key, relativeVolume, sound._volume);
    }
  } else {
    // no panning, same volume on both channels
    RNSound.setVolume(sound._key, sound._volume, sound._volume);
  }
}

function Sound(filename, basePath, onError, options) {
  var asset = resolveAssetSource(filename);
  if (asset) {
    this._filename = asset.uri;
    onError = basePath;
  } else {
    this._filename = basePath ? basePath + '/' + filename : filename;

    if (IsAndroid && !basePath && isRelativePath(filename)) {
      this._filename = filename.toLowerCase().replace(/\.[^.]+$/, '');
    }
  }

  this.registerOnPlay = function() {
    if (this.onPlaySubscription != null) {
      console.warn('On Play change event listener is already registered');
      return;
    }

    if (!IsWindows) {
      this.onPlaySubscription = eventEmitter.addListener(
        'onPlayChange',
        (param) => {
          const { isPlaying, playerKey } = param;
          if (playerKey === this._key) {
            if (isPlaying) {
              this._playing = true;
            }
            else {
              this._playing = false;
            }
          }
        },
      );
    }
  }

  this._loaded = false;
  this._key = nextKey++;
  this._playing = false;
  this._duration = -1;
  this._numberOfChannels = -1;
  this._volume = 1;
  this._pan = 0;
  this._numberOfLoops = 0;
  this._speed = 1;
  this._pitch = 1;

  if(IsAndroid|| IsWindows){
    RNSound.prepare(this._filename, this._key, options || {}, (error, props) => {
      if (props) {
        if (typeof props.duration === 'number') {
          this._duration = props.duration;
        }
        if (typeof props.numberOfChannels === 'number') {
          this._numberOfChannels = props.numberOfChannels;
        }
      }
      if (error === null) {
        this._loaded = true;
        this.registerOnPlay();
      }
      onError && onError(error, props);
    });
  }

}

Sound.prototype.isLoaded = function() {
   if(IsAndroid||IsWindows){
      return this._loaded;
   }else {
    RNSound.isLoaded();
   }
  
};


  Sound.prototype.play = function(onEnd) {
    if(IsAndroid||IsWindows){
      if (this._loaded) {
        RNSound.play(this._key, (successfully) => onEnd && onEnd(successfully));
      } else {
        onEnd && onEnd(false);
      }
    }else{
      RNSound.play();
    }
    return this;
  };



Sound.prototype.pause = function(callback) {
  if(IsAndroid||IsWindows){
    if (this._loaded) {
      RNSound.pause(this._key, () => {
        this._playing = false;
        callback && callback();
      });
    }
  }else{
    RNSound.pause();
  }

  return this;
};

Sound.prototype.stop = function(callback) {
  if(IsAndroid||IsWindows){
    if (this._loaded) {
      RNSound.stop(this._key, () => {
        this._playing = false;
        callback && callback();
      });
    }
  }else{
    RNSound.stop();
  }

  return this;
};

Sound.prototype.reset = function() {
  if(IsAndroid||IsWindows){
    if (this._loaded && IsAndroid) {
      RNSound.reset(this._key);
      this._playing = false;
    }
  }else{
    RNSound.reset();
  }

  return this;
};

Sound.prototype.release = function() {
  if(IsAndroid||IsWindows){
    if (this._loaded) {
      RNSound.release(this._key);
      this._loaded = false;
      if (!IsWindows) {
        if (this.onPlaySubscription != null) {
          this.onPlaySubscription.remove();
          this.onPlaySubscription = null;
        }
      }
    }
  }else{
    RNSound.release();
  }

  return this;
};

Sound.prototype.getFilename = function() {
  return this._filename;
};

Sound.prototype.getDuration = function() {
  if(IsAndroid||IsWindows){
    return this._duration;
  }else{
    RNSound.getDuration();
  }
  
};

Sound.prototype.getNumberOfChannels = function() {
  if(IsAndroid||IsWindows){
    return this._numberOfChannels;
  }else {
    RNSound.getNumberOfChannels();
  }
 
};

Sound.prototype.getVolume = function() {
    if(IsAndroid||IsWindows){
      return this._volume;
    }else {
      RNSound.getVolume();
    }
 
};

Sound.prototype.getSpeed = function() {
  if(IsAndroid||IsWindows){
    return this._speed;
  }else {
    RNSound.getSpeed();
  }
};

Sound.prototype.getPitch = function() {
  return this._pitch;
};

Sound.prototype.setVolume = function(value) {
  if(IsAndroid||IsWindows){
      this._volume = value;
      if (this._loaded) {
        if (IsAndroid) {
          setAndroidVolumes(this)
        } else {
          RNSound.setVolume(this._key, value);
        }
      }
    }else{
      RNSound.setVolume(value);
    }

  return this;
};

Sound.prototype.setPan = function(value) {
  this._pan = value;
  if (this._loaded) {
    if (IsWindows) {
      throw new Error('#setPan not supported on windows');
    } else if (IsAndroid) {
      setAndroidVolumes(this)
    } else {
      RNSound.setPan(this._key, value);
    }
  }
  return this;
};

Sound.prototype.getSystemVolume = function(callback) {
  if(!IsWindows) {
    RNSound.getSystemVolume(callback);
  }
  return this;
};

Sound.prototype.setSystemVolume = function(value) {
  if (IsAndroid) {
    RNSound.setSystemVolume(value);
  }
  return this;
};

Sound.prototype.getPan = function() {
  return this._pan;
};

Sound.prototype.getNumberOfLoops = function() {
  return this._numberOfLoops;
};

Sound.prototype.setNumberOfLoops = function(value) {
  this._numberOfLoops = value;
  if (this._loaded) {
    if (IsAndroid || IsWindows) {
      RNSound.setLooping(this._key, !!value);
    } else {
      RNSound.setNumberOfLoops(this._key, value);
    }
  }
  return this;
};

Sound.prototype.setSpeed = function(value) {
  if(IsAndroid||IsWindows){
    this._speed = value;
    if (this._loaded) {
      if (!IsWindows) {
        RNSound.setSpeed(this._key, value);
      }
    }
  }else{
    RNSound.setSpeed(value);
  }
  return this;
};

Sound.prototype.setPitch = function(value) {
  if(IsAndroid||IsWindows){
    this._pitch = value;
    if (this._loaded) {
      if (IsAndroid) {
        RNSound.setPitch(this._key, value);
      }
    }
  }else{
    RNSound.setPitch(value);
  }

  return this;
};

Sound.prototype.getCurrentTime = function(callback) {
  if(IsAndroid||IsWindows){
    if (this._loaded) {
      RNSound.getCurrentTime(this._key, callback);
    }
  }else{
    RNSound.getCurrentTime();
  }
 
};

Sound.prototype.setCurrentTime = function(value) {
  if(IsAndroid||IsWindows){
    if (this._loaded) {
      RNSound.setCurrentTime(this._key, value);
    }    
  }else{
    RNSound.setCurrentTime(value);
  }

  
  return this;
};

// android only
Sound.prototype.setSpeakerphoneOn = function(value) {
  if (IsAndroid) {
    RNSound.setSpeakerphoneOn(this._key, value);
  }
};

// ios only

// This is deprecated.  Call the static one instead.

Sound.prototype.setCategory = function(value) {
  Sound.setCategory(value, false);
}

Sound.prototype.isPlaying = function() {
  if(IsAndroid||IsWindows){
    return this._playing;
  }else{
    RNSound.isPlaying();
  }
  
}

Sound.enable = function(enabled) {
  RNSound.enable(enabled);
};

Sound.enableInSilenceMode = function(enabled) {
  if (!IsAndroid && !IsWindows) {
    RNSound.enableInSilenceMode(enabled);
  }
};

Sound.setActive = function(value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setActive(value);
  }
};

Sound.setCategory = function(value, mixWithOthers = false) {
  if (!IsWindows) {
    RNSound.setCategory(value, mixWithOthers);
  }
};

Sound.setMode = function(value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setMode(value);
  }
};

Sound.setSpeakerPhone = function(value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setSpeakerPhone(value)
  }
}

Sound.MAIN_BUNDLE = RNSound.MainBundlePath;
Sound.DOCUMENT = RNSound.NSDocumentDirectory;
Sound.LIBRARY = RNSound.NSLibraryDirectory;
Sound.CACHES = RNSound.NSCachesDirectory;

module.exports = Sound;
