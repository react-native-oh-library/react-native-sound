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

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type AVAudioSessionCategory = 'Ambient' | 'SoloAmbient' | 'Playback' | 'Record' | 'PlayAndRecord' | 'AudioProcessing' | 'MultiRoute' | 'Alarm'

type AVAudioSessionMode = 'Default' | 'VoiceChat' | 'VideoChat' | 'GameChat' | 'VideoRecording' | 'Measurement' | 'MoviePlayback' | 'SpokenAudio'

type FilenameType = string

type FileType = any

type BasePathType = string

type CallbackType = (error: any) => void


export interface Spec extends TurboModule {
   
    setActive:(active: boolean)=> void
  

    setCategory(category: AVAudioSessionCategory, mixWithOthers?: boolean): void
  

    setMode(mode: AVAudioSessionMode): void


    isLoaded(): boolean
  

    //play(onEnd?: (success: boolean) => void): this
    play(onEnd?: (success: boolean) => void): void
  

    //pause(cb?: () => void): this
    pause(cb?: () => void): void
  

    //stop(cb?: () => void): this
    stop(cb?: () => void): void
  

    //reset(): this
    reset(): void
  

    //release(): this
    release(): void
    

    getNumberOfChannels(): number
    

    getDuration(): number
    

    getVolume(): number
    

    //setVolume(value: number): this
    setVolume(value: number): void
    

    getPan(): number
    

    //setPan(value: number): this
    setPan(value: number): void
    

    getNumberOfLoops(): number
    

    //setNumberOfLoops(value: number): this
    setNumberOfLoops(value: number): void
    

    getCurrentTime(cb?: (seconds: number, isPlaying: boolean) => void): number
    

    //setCurrentTime(value: number): this
    setCurrentTime(value: number): void
    

    getSpeed(): number
    

    //setSpeed(value: number): this
    setSpeed(value: number): void
    

    getPitch(): number
    

    setPitch(value: number): void
    

    enableInSilenceMode(enabled: boolean): void
    

    setCategory(value: AVAudioSessionCategory): void
    

    setSpeakerphoneOn(value: boolean): void
  

    isPlaying(): boolean
  }

  // 'RNCSound' 为最后导出的TurboModule名称，后续通过识别名称来识别模块。
  export default TurboModuleRegistry.getEnforcing<Spec>('RNCSound');