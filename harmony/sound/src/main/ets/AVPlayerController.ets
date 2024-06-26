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

import media from '@ohos.multimedia.media';
import common from '@ohos.app.ability.common';
import audio from '@ohos.multimedia.audio';
import { BusinessError } from '@kit.BasicServicesKit';
import Logger from './Logger';

const TAG: string = "[RNOH] Sound"

let avPlayer: media.AVPlayer;

export interface PrepareProps {
  duration: number
  numberOfChannels?: number
}

interface E {
  code: number,
  message: string
}

enum Speed{
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

export class AVPlayerController {
  private audioManager = audio.getAudioManager();
  public playerPool = new Object();
  public isPlaying: boolean = false;
  async prepare(fileName: string, key: number, option: object, callBack: (error: E, props:PrepareProps) => void) {
    const mediaPlayer: media.AVPlayer = await media.createAVPlayer();
    let filename: string = '';
    if(fileName.startsWith('asset')){
      filename = fileName.split('//')[1];
      let context = getContext(this) as common.UIAbilityContext;
      let fileDescriptor = await context.resourceManager.getRawFd(`assets/${filename}`);
      mediaPlayer.fdSrc = fileDescriptor;
    } else {
      mediaPlayer.url = fileName;
    }

    const mediaPrepare = () => {
      mediaPlayer.prepare().then(()=>{
        const props:PrepareProps = {
          duration:mediaPlayer.duration,
        }
        Logger.info(TAG, `avPlay prepare success`);
        callBack(null, props);
      },(err: BusinessError)=>{
        Logger.info(TAG, `avPlay prepare error:${err.name} message ${err.message}`);
        const e: E = {
          code: -1,
          message: `avPlay prepare error:${err.name} message ${err.message}}`
        }
        callBack(e, null);
      });
    }

    mediaPlayer.on('stateChange', async (state, reason) => {
      Logger.info(TAG, `stateChange128:  AVPlayer state idle called${state}`);
      switch (state) {
        case 'initialized': // avplayer 设置播放源后触发该状态上报
          Logger.info(TAG, 'stateChange AVPlayerstate initialized called.');
          mediaPrepare()
          break;
        default:
          Logger.info(TAG, 'stateChange AVPlayer state unknown called.');
          break;
      }
    })

    if (mediaPlayer == null) {
      const e: E = {
        code: -1,
        message: "resource not found"
      }
      callBack(e, null);
      return;
    }

    this.playerPool[key] = mediaPlayer
    //设置默认音量
    avPlayer.setVolume(1.00);
    //设置默认速度
    avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)

    //播放错误监听
    avPlayer.on('error', (err: BusinessError) => {
      console.error(TAG,`failed, code is ${err.code}, message is ${err.message}`);
      avPlayer.reset(); // 调用reset重置资源，触发idle状态
    })
  }

  play(key: number, callback?: (success: boolean ) => void): void {
    const player: media.AVPlayer = this.playerPool[key];
    if (player == null) {
      if (callback != null) {
        callback(false);
      }
      return;
    }

    player.on('stateChange', (state, reason) => {
      switch (state) {
        case 'completed': // 播放结束后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state completed Start play callback.');
          callback?.(true)
          this.isPlaying = false;
          break;
        case 'playing': // play成功调用后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state playing called.');
          this.isPlaying = true;
          break;
        default:
          this.isPlaying = false;
          Logger.info(TAG, 'stateChange AVPlayer state unknown called.');
          break;
      }
    })

    player.play()
  }

  pause(key: number, cb?: () => void): void {
    const player: media.AVPlayer = this.playerPool[key];
    if (player != null && this.isPlaying) {
      player.pause().then(()=>{
        Logger.info(TAG, `sound: AVPlayer pause success`);
        cb?.();
      }, ( err: Error)=>{
        Logger.error(TAG, `sound: AVPlayer pause error${err.name}, message is ${err.message}`);
      });
    }
  }

  stop(key: number, cb?: () => void): void {
    const player: media.AVPlayer = this.playerPool[key];
    if (player != null && this.isPlaying) {
      player.stop().then(() => {
        Logger.info(TAG, `sound: AVPlayer pause success`);
        cb?.();
      }, (err: Error) => {
        Logger.error(TAG, `sound: AVPlayer pause error${err.name}, message is ${err.message}`);
      });
    }
  }

  reset(key: number): void {
    const player: media.AVPlayer = this.playerPool[key];
    try {
      player.reset();
    } catch (e) {
      Logger.info(TAG, 'sound reset error: ' + JSON.stringify(e));
    }
  }

  release(key: number): void {
    const player: media.AVPlayer = this.playerPool[key];
    player.release();
  }

  getDuration(key: number) {
    const player: media.AVPlayer = this.playerPool[key];
    return player.duration;
  }

  setVolume(key: number, volume: number) {
    const player: media.AVPlayer = this.playerPool[key];
    player.setVolume(volume)
  }

  getCurrentTime(key: number, callback?: (currentPosition: number, isPlaying: boolean)=>void) {
    const player: media.AVPlayer = this.playerPool[key];
    if (player == null) {
      callback?.(-1, false);
      return;
    }
    callback?.(player.currentTime, this.isPlaying);
  }

  setCurrentTime(key: number, value: number): void {
    const player: media.AVPlayer = this.playerPool[key];
    if (value < 0) {
      value = 0
    } else if (value > player.duration) {
      value = player.duration;
    }
    player.seek(value, media.SeekMode.SEEK_PREV_SYNC)
  }

  // value is : 0,1,2,3,4
  setSpeed(key:number, value: number): void {
    const player: media.AVPlayer = this.playerPool[key];
    switch (value) {
      case Speed.ZERO:
        player.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_0_75_X)
        break
      case Speed.ONE:
        player.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)
        break
      case Speed.TWO:
        player.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_25_X)
        break
      case Speed.THREE:
        player.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_75_X)
        break
      case Speed.FOUR:
        player.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_2_00_X)
        break
    }
  }

  setActive(active: boolean): void {
    this.audioManager.getRoutingManager()
      .setCommunicationDevice(audio.CommunicationDeviceType.SPEAKER, active, (err) => {
        if (err) {
          Logger.error(TAG, `sound Failed to set the active status of the device. ${err}`);
          return;
        }
        Logger.info(TAG, 'sound Callback invoked to indicate that the device is set to the active status.');
      });

  }

  setNumberOfLoops(key:number, value: boolean): void {
    const player: media.AVPlayer = this.playerPool[key];
    player.loop = value
  }
}
