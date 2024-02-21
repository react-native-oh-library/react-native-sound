import { TurboModule, TurboModuleContext } from 'rnoh/ts';
import { AVPlayerController } from './ts'

export class SoundTurboModule extends TurboModule {
  controller: AVPlayerController = new AVPlayerController()

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    console.log('[RNOH]:SoundTurboModule constructor');

  }

  setActive(active: boolean): void {
    this.controller.setActive(active)
  }

  isLoaded(): boolean {
    console.log('sound isLoaded : ', this.controller.getIsLoaded())
    return this.controller.getIsLoaded()
  }

  getDuration(): number {
    console.log('sound getDuration: ',this.controller.getDuration())
    return this.controller.getDuration();
  }


  play(onEnd?: (success: boolean) => void): void {
    console.log('sound: ', 'play start')
    this.controller.play();
  }

  pause(cb?: () => void): void {
    console.log('sound: ', 'pause success')
    this.controller.pause();
  }

  stop(cb?: () => void): void {
    console.log('sound: ', 'stop success')
    this.controller.stop();
  }

  reset(): void {
    console.log('sound: ', 'reset success')
    this.controller.reset();
  }

  release(): void {
    console.log('sound: ', 'release success')
    this.controller.release();
  }

  getVolume(): number {
    console.log('sound getVolume: ', this.controller.getVolume())
    return this.controller.getVolume();
  }

  setVolume(value: number): void {
    console.log('sound setVolume: ', value)
    this.controller.setVolume(value)
  }

  getCurrentTime(): number {
    console.log('sound getCurrentTime: ', this.controller.getCurrentTime())
    return this.controller.getCurrentTime();
  }

  setCurrentTime(value: number): void {
    if (value < 0) value = 0;
    else if (value > this.controller.getDuration()) value = this.controller.getDuration();
    console.log('sound setCurrentTime: ', value)
    this.controller.setCurrentTime(value);
  }

  getSpeed(): number {
    console.log('sound getSpeed: ', this.controller.getSpeed())
    return this.controller.getSpeed();
  }

  setSpeed(value: number): void {
    console.log('sound setSpeed: ', value)
    this.controller.setSpeed(value);
  }

  isPlaying(): boolean {
    console.log('sound isPlaying: ', this.controller.isPlaying)
    return this.controller.isPlaying;
  }

  getNumberOfLoops() {
    console.log('sound getNumberOfLoops: ',this.controller.getNumberOfLoops())
    return this.controller.getNumberOfLoops();
  }

  setNumberOfLoops(value: boolean): void {
    console.log('sound setNumberOfLoops: ',value)
    this.controller.setNumberOfLoops(value)
  }
}