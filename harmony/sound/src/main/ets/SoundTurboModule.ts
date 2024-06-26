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

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { AVPlayerController } from './ts'
import Logger from './Logger';

const TAG: string = "[RNOH] Sound"

export class SoundTurboModule extends TurboModule {
  controller: AVPlayerController = new AVPlayerController()
  prepare(filename: string, key: number, option: object, callBack: ()=>void) {
      this.controller.prepare(filename, key, option, callBack)
  }

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    Logger.info(TAG, '[RNOH]:SoundTurboModule constructor');
  }

  setActive(active: boolean): void {
    this.controller.setActive(active)
  }

  getDuration(key:number): number {
    Logger.info(TAG, 'sound getDuration : '+ this.controller.getDuration(key));
    return this.controller.getDuration(key);
  }

  play(key, onEnd?: (success: boolean) => void): void {
    Logger.info(TAG, 'sound  : '+ 'play start');
    this.controller.play(key, onEnd);
  }

  pause(key, cb?: () => void): void {
    Logger.info(TAG, 'sound  : '+ 'pause success');
    this.controller.pause(key, cb);
  }

  stop(key, cb?: () => void): void {
    Logger.info(TAG, 'sound  : '+ 'stop success');
    this.controller.stop(key, cb);
  }

  reset(key): void {
    Logger.info(TAG, 'sound  : '+ 'reset success');
    this.controller.reset(key);
  }

  release(key): void {
    Logger.info(TAG, 'sound  : '+ 'release success');
    this.controller.release(key);
  }

  setVolume(key: number, value: number): void {
    Logger.info(TAG, 'sound setVolume : '+ value);
    this.controller.setVolume(key, value)
  }

  getCurrentTime(key: number, callBack?: (currentPosition: number, isPlaying: boolean) => void): void {
    Logger.info(TAG, 'sound getCurrentTime')
    return this.controller.getCurrentTime(key, callBack);
  }

  setCurrentTime(key: number, value: number): void {
    Logger.info(TAG, 'sound setCurrentTime : '+ value);
    this.controller.setCurrentTime(key, value);
  }

  setSpeed(key: number, value: number): void {
    Logger.info(TAG, 'sound setSpeed : '+ value);
    this.controller.setSpeed(key, value);
  }

  setNumberOfLoops(key:number, value: boolean): void {
    Logger.info(TAG, 'sound setNumberOfLoops : '+ value);
    this.controller.setNumberOfLoops(key, value)
  }

  addListener(eventName: string) {
    Logger.info(TAG, 'addListener : '+ eventName);
  }

  removeListeners(count: number) {
    Logger.info(TAG, 'removeListeners : '+ count);
  }
}