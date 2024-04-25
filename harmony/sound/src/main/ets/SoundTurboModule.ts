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

  prepare(filename: string) {
      this.controller.setFileDescriptor(filename)
  }

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    Logger.info(TAG, '[RNOH]:SoundTurboModule constructor');
  }

  setActive(active: boolean): void {
    this.controller.setActive(active)
  }

  isLoaded(): boolean {
    Logger.info(TAG, 'sound isLoaded : '+ this.controller.getIsLoaded());
    return this.controller.getIsLoaded()
  }

  getDuration(): number {
    Logger.info(TAG, 'sound getDuration : '+ this.controller.getDuration());
    return this.controller.getDuration();
  }


  play(onEnd?: (success: boolean) => void): void {
    Logger.info(TAG, 'sound  : '+ 'play start');
    this.controller.play();
  }

  pause(cb?: () => void): void {
    Logger.info(TAG, 'sound  : '+ 'pause success');
    this.controller.pause();
  }

  stop(cb?: () => void): void {
    Logger.info(TAG, 'sound  : '+ 'stop success');
    this.controller.stop();
  }

  reset(): void {
    Logger.info(TAG, 'sound  : '+ 'reset success');
    this.controller.reset();
  }

  release(): void {
    Logger.info(TAG, 'sound  : '+ 'release success');
    this.controller.release();
  }

  getVolume(): number {
    Logger.info(TAG, 'sound getVolume : '+ this.controller.getVolume());
    return this.controller.getVolume();
  }

  setVolume(value: number): void {
    Logger.info(TAG, 'sound setVolume : '+ value);
    this.controller.setVolume(value)
  }

  getCurrentTime(): number {
    Logger.info(TAG, 'sound getCurrentTime : '+ this.controller.getCurrentTime());
    return this.controller.getCurrentTime();
  }

  setCurrentTime(value: number): void {
    if (value < 0) value = 0;
    else if (value > this.controller.getDuration()) value = this.controller.getDuration();
    Logger.info(TAG, 'sound setCurrentTime : '+ value);
    this.controller.setCurrentTime(value);
  }

  getSpeed(): number {
    Logger.info(TAG, 'sound getSpeed : '+ this.controller.getSpeed());
    return this.controller.getSpeed();
  }

  setSpeed(value: number): void {
    Logger.info(TAG, 'sound setSpeed : '+ value);
    this.controller.setSpeed(value);
  }

  isPlaying(): boolean {
    Logger.info(TAG, 'sound isPlaying : '+ this.controller.isPlaying);
    return this.controller.isPlaying;
  }

  getNumberOfLoops() {
    Logger.info(TAG, 'sound getNumberOfLoops : '+ this.controller.getNumberOfLoops());
    return this.controller.getNumberOfLoops();
  }

  setNumberOfLoops(value: boolean): void {
    Logger.info(TAG, 'sound setNumberOfLoops : '+ value);
    this.controller.setNumberOfLoops(value)
  }
}