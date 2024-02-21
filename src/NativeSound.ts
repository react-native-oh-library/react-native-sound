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