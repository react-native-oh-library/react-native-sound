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

import Logger from './Logger';

const TAG: string = "[RNOH] Sound"

let avPlayer: media.AVPlayer;

export class AVPlayerController {

  private filename: string = '';
  private volume: number = 1.00;
  private speed: number = 1;
  private isLoaded: boolean = false;
  public isPlaying: boolean = false;
  private audioManager = audio.getAudioManager();

  // 源库isLoaded()接口替代方案
  setIsLoaded(isLoaded: boolean) {
    this.isLoaded = isLoaded;
  }

  // 对外提供获取状态
  getIsLoaded() {
    return this.isLoaded;
  }

  constructor() {
    this.avPlayerFdSrcDemo();
  }

  // 以下demo为使用资源管理接口获取打包在HAP内的媒体资源文件并通过fdSrc属性进行播放示例
  async avPlayerFdSrcDemo() {
    // 创建avPlayer实例对象
    avPlayer = await media.createAVPlayer();
    // 创建状态机变化回调函数
    this.setAVPlayerCallback();
    // 通过UIAbilityContext的resourceManager成员的getRawFd接口获取媒体资源播放地址

    //设置默认音量
    avPlayer.setVolume(1.00);
    //设置默认速度
    avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)

  }

    async setFileDescriptor(fileName: string) {
      this.filename = fileName;
      let context = getContext(this) as common.UIAbilityContext;
      let fileDescriptor = await context.resourceManager.getRawFd(fileName);
      // 为fdSrc赋值触发initialized状态机上报
      avPlayer.fdSrc = fileDescriptor;
    }

  // 注册avplayer回调函数
  setAVPlayerCallback() {
    // 状态机变化回调函数
    avPlayer.on('stateChange', async (state, reason) => {
      switch (state) {
        case 'idle': // 成功调用reset接口后触发该状态机上报
          Logger.info(TAG, 'stateChange:  AVPlayer state idle called.');
        /*
         * 以下代码是为了 调用reset后 无法继续播放
         * 在Idle 状态设置 url9+ 或 fdSrc9+属性，AVPlayer会进入initialized状态
         */
          if (this.filename) {
            this.setFileDescriptor(this.filename);
          }
          avPlayer.prepare();

          break;
        case 'initialized': // avplayer 设置播放源后触发该状态上报
          Logger.info(TAG, 'stateChange AVPlayerstate initialized called.');
          avPlayer.prepare();
          break;
        case 'prepared': // prepare调用成功后上报该状态机
          Logger.info(TAG, 'stateChange AVPlayer state prepared called.');
          this.setIsLoaded(true); // 音频准备就绪
          this.isPlaying = false
        // avPlayer.play(); // 调用播放接口开始播放
          break;
        case 'playing': // play成功调用后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state playing called.');
          this.isPlaying = true;
          break;
        case 'paused': // pause成功调用后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state paused called.');
          this.isPlaying = false
        //avPlayer.play(); // 再次播放接口开始播放
          break;
        case 'completed': // 播放结束后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state completed called.');
          this.isPlaying = false
        // avPlayer.stop(); //调用播放结束接口
          break;
        case 'stopped': // stop接口成功调用后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state stopped called.');
          this.isPlaying = false

        // stop状态重新调用prepare 用于下次可直接播放
          avPlayer.prepare().then(() => {
            Logger.info(TAG, 'sound: AVPlayer prepare succeeded.');
          }, (err: Error) => {
            Logger.error(TAG, `stateChange: Invoke prepare failed, code is ${err.name}, message is ${err.message}`);
          });

        //avPlayer.reset(); // 调用reset接口初始化avplayer状态
          break;
        case 'released':
          Logger.info(TAG, 'stateChange AVPlayer state released called.');
          this.isPlaying = false
          break;
        default:
          Logger.info(TAG, 'stateChange AVPlayer state unknown called.');
          this.isPlaying = false
          break;
      }
    })

    //音量监听
    avPlayer.on('volumeChange', (vol: number) => {
      Logger.info(TAG, 'volumeChange success,and new volume is :' + vol);
      this.volume = vol
    })

    //监听seek生效的事件
    avPlayer.on('seekDone', (seekDoneTime: number) => {
      Logger.info(TAG, 'seekDone success,and seek time is:' + seekDoneTime);
    })

    //监听播放速度
    avPlayer.on('speedDone', (speed: number) => {
      Logger.info(TAG, 'speedDone success,and speed value is:' + speed);
    })
  }

  play(onEnd?: (success: boolean) => void): void {
    Logger.info(TAG, 'sound duration: ' + avPlayer.duration);
    avPlayer.play()
  }

  pause(cb?: () => void): void {
    avPlayer.pause();
  }

  stop(cb?: () => void): void {
    avPlayer.stop();
  }

  reset(): void {
    try {
      avPlayer.reset();
    } catch (e) {
      Logger.info(TAG, 'sound reset error: ' + JSON.stringify(e));
    }
  }

  release(): void {
    avPlayer.release();
  }

  getDuration() {
    return avPlayer.duration;
  }

  setVolume(volume: number) {
    //The volume ranges from 0.00 to 1.00
    avPlayer.setVolume(volume)
  }

  getVolume() {
    return this.volume;
  }

  getCurrentTime() {
    return avPlayer.currentTime;
  }

  setCurrentTime(value: number): void {
    if (value < 0) value = 0;
    else if (value > avPlayer.duration) value = avPlayer.duration;
    avPlayer.seek(value, media.SeekMode.SEEK_PREV_SYNC)
  }

  getSpeed() {
    return this.speed;
  }

  // value is : 0,1,2,3,4
  setSpeed(value: number): void {
    switch (value) {
      case 0:
        this.speed = 0;
        avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_0_75_X)
        break
      case 1:
        this.speed = 1;
        avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)
        break
      case 2:
        this.speed = 2;
        avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_25_X)
        break
      case 3:
        this.speed = 3;
        avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_75_X)
        break
      case 3:
        this.speed = 4;
        avPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_2_00_X)
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

  getNumberOfLoops() {
    return avPlayer.loop;
  }

  setNumberOfLoops(value: boolean): void {
    avPlayer.loop = value
  }
}
