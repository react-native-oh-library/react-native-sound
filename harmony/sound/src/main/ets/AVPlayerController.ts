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
import audio from '@ohos.multimedia.audio';
import { avSession as AVSessionManager } from '@kit.AVSessionKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { backgroundTaskManager } from '@kit.BackgroundTasksKit';
import { wantAgent, WantAgent } from '@kit.AbilityKit';
import { AbilityConstant, Want } from '@kit.AbilityKit';
import Logger from './Logger';
import { AVAudioSessionCategory, AvplayerStatus,AvplayerSessionCategory } from './ts';
const TAG: string = "[RNOH] Sound"

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
  public playerPool = new Map<Object, media.AVPlayer>();
  public isPlaying: boolean = false;
  private category:AVAudioSessionCategory = "Playback";
  private mixWithOthers:Boolean = true;
  private context = getContext(this);

  //创建后台长任务
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
    let wantAgentInfo: wantAgent.WantAgentInfo = {
      // 点击通知后，将要执行的动作列表
      wants: [
        {
          bundleName: "com.example.myapplication",
          abilityName: "EntryAbility"
        }
      ],
      // 点击通知后，动作类型
      actionType: wantAgent.OperationType.START_ABILITY,
      // 使用者自定义的一个私有值
      requestCode: 0,
      // 点击通知后，动作执行属性
      wantAgentFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG]
    };

    try {
      // 通过wantAgent模块下getWantAgent方法获取WantAgent对象
      wantAgent.getWantAgent(wantAgentInfo).then((wantAgentObj: WantAgent) => {
        try {
          backgroundTaskManager.startBackgroundRunning(this.context,
            backgroundTaskManager.BackgroundMode.LOCATION, wantAgentObj, (error: BusinessError, data: void)=>{

            })
        } catch (error) {

        }
      });
    } catch (error) {

    }
  }

  // 开始创建并激活媒体会话
  // 创建session
  async createSession() {
    let type: AVSessionManager.AVSessionType = 'audio';
    let session = await AVSessionManager.createAVSession(this.context,'SESSION_NAME', type);

    // 激活接口要在元数据、控制命令注册完成之后再执行
    await session.activate();
  }

  setAudioRendererInfo(mediaPlayer: media.AVPlayer){
    if (this.category != null) {
      switch (this.category) {
        case AvplayerSessionCategory.AMBIENT: //游戏模式
          mediaPlayer.audioRendererInfo = {content:audio.ContentType.CONTENT_TYPE_MUSIC, usage: audio.StreamUsage.STREAM_USAGE_GAME, rendererFlags: 0}
          break;
        case AvplayerSessionCategory.PLAYANDRECORD:
          mediaPlayer.audioRendererInfo = {content:audio.ContentType.CONTENT_TYPE_MUSIC, usage: audio.StreamUsage.STREAM_USAGE_VOICE_COMMUNICATION, rendererFlags: 0}
          break;
        case AvplayerSessionCategory.PLAYBACK:
          this.createSession()
          break;
        default:
          Logger.info(TAG, `RNSoundModule Unrecognised category ${this.category}`);
          break;
      }

    }
  }

  mediaPrepare(mediaPlayer: media.AVPlayer, callBack: (error: E | null, props:PrepareProps | null) => void){
    mediaPlayer.prepare().then(()=>{
      const props:PrepareProps = {
        duration:mediaPlayer.duration,
      }
      callBack(null, props);
    },(err: BusinessError)=>{
      const e: E = {
        code: -1,
        message: `avPlay prepare error:${err.name} message ${err.message}}`
      }
      callBack(e, null);
    });
  }

  async prepare(fileName: string, key: number, option: object, callBack: (error: E | null, props:PrepareProps | null) => void) {
    const mediaPlayer: media.AVPlayer = await media.createAVPlayer();
    let fileUrl: string = '';
    if(fileName.startsWith('asset')){  //在npm run dev起服务的时候 用require('./frog.wav') 引入的文件
      fileUrl = fileName.split('//')[1];
      let fileDescriptor = await this.context.resourceManager.getRawFd(`assets/${fileUrl}`);
      mediaPlayer.fdSrc = fileDescriptor;
    } else if(fileName.startsWith("http://") || fileName.startsWith("https://")){//音频资源是网络资源和npm run start起服务的时候 用require('./frog.wav') 引入的文件
      mediaPlayer.url = fileName;
    } else {   //资源在resources/rawfile 下的资源  url: 'whoosh.mp3',
      let fileDescriptor = await this.context.resourceManager.getRawFd(fileName);
      mediaPlayer.fdSrc = fileDescriptor;
    }
    
    mediaPlayer.on('stateChange', async (state, reason) => {
      Logger.info(TAG, `stateChange128:  AVPlayer state idle called ${state}`);
      switch (state) {
        case AvplayerStatus.IDLE:
          Logger.info(TAG, 'stateChange AVPlayerstate initialized called. idle');
          this.mediaPrepare(mediaPlayer,callBack)
          break;
        case AvplayerStatus.INITIALIZED: // avplayer 设置播放源后触发该状态上报
          this.setAudioRendererInfo(mediaPlayer);
          this.mediaPrepare(mediaPlayer,callBack);
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

    this.playerPool.set(key, mediaPlayer)
    //设置默认音量
    mediaPlayer.setVolume(1.00);
    //设置默认速度
    mediaPlayer.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)

    //播放错误监听
    mediaPlayer.on('error', (err: BusinessError) => {
      Logger.error(TAG,`failed, code is ${err.code}, message is ${err.message}`);
      mediaPlayer.reset(); // 调用reset重置资源，触发idle状态
    })
  }

  play(key: number, callback?: (success: boolean ) => void): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if (player === null && player === undefined) {
      if (callback != null) {
        callback(false);
      }
      return;
    }

    player?.on('stateChange', (state, reason) => {
      switch (state) {
        case AvplayerStatus.COMPLETED: // 播放结束后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state completed Start play callback.');
          callback?.(true)
          this.isPlaying = false;
          break;
        case AvplayerStatus.PLAYING: // play成功调用后触发该状态机上报
          Logger.info(TAG, 'stateChange AVPlayer state playing called.');
          this.isPlaying = true;
          break;
        default:
          this.isPlaying = false;
          Logger.info(TAG, 'stateChange AVPlayer state unknown called.');
          break;
      }
    })

    player?.play()
  }

  pause(key: number, cb?: () => void): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if (this.isPlaying) {
      player?.pause().then(()=>{
        Logger.info(TAG, `sound: AVPlayer pause success`);
        cb?.();
      }, ( err: Error)=>{
        Logger.error(TAG, `sound: AVPlayer pause error${err.name}, message is ${err.message}`);
      });
    }
  }

  stop(key: number, cb?: () => void): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if (this.isPlaying) {
      player?.stop().then(() => {
        Logger.info(TAG, `sound: AVPlayer pause success`);
        cb?.();
      }, (err: Error) => {
        Logger.error(TAG, `sound: AVPlayer pause error${err.name}, message is ${err.message}`);
      });
    }
  }

  reset(key: number): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    try {
      player?.reset();
    } catch (e) {
      Logger.info(TAG, `sound reset error: ${e}} ` );
    }
  }

  release(key: number): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    player?.release();
  }

  getDuration(key: number) {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    return player?.duration;
  }

  setVolume(key: number, volume: number) {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    player?.setVolume(volume)
  }

  getCurrentTime(key: number, callback?: (currentPosition: number | undefined, isPlaying: boolean)=>void) {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if (player === null && player === undefined) {
      callback?.(-1, false);
      return;
    }
    callback?.(player?.currentTime, this.isPlaying);
  }

  setCurrentTime(key: number, value: number): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if(player !== null && player !== undefined){
      if (value < 0) {
        value = 0
      } else if (value > player.duration) {
        value = player.duration;
      }
      player?.seek(value, media.SeekMode.SEEK_PREV_SYNC)
    }

  }

  // value is : 0,1,2,3,4
  setSpeed(key:number, value: number): void {
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    switch (value) {
      case Speed.ZERO:
        player?.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_0_75_X)
        break
      case Speed.ONE:
        player?.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_00_X)
        break
      case Speed.TWO:
        player?.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_25_X)
        break
      case Speed.THREE:
        player?.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_1_75_X)
        break
      case Speed.FOUR:
        player?.setSpeed(media.PlaybackSpeed.SPEED_FORWARD_2_00_X)
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
    const player: media.AVPlayer | undefined = this.playerPool.get(key);
    if(player !== null && player !== undefined){
      player.loop = value
    }
  }

  setCategory(category: AVAudioSessionCategory, mixWithOthers: boolean):void{
    this.category = category
    this.mixWithOthers = mixWithOthers
  }
}

