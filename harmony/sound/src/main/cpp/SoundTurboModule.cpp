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


/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "RNOH/ArkTSTurboModule.h"
#include "SoundTurboModule.h"


using namespace rnoh;
using namespace facebook;

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_setActive(jsi::Runtime &rt,
                                                                         react::TurboModule &turboModule,
                                                                         const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "setActive", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_isLoaded(jsi::Runtime &rt,
                                                                        react::TurboModule &turboModule,
                                                                        const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "isLoaded", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_play(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                    const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "play", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_pause(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                     const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "pause", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_stop(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                    const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "stop", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_reset(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                     const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "reset", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_release(jsi::Runtime &rt,
                                                                       react::TurboModule &turboModule,
                                                                       const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "release", args, count);
}


static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_getVolume(jsi::Runtime &rt,
                                                                         react::TurboModule &turboModule,
                                                                         const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getVolume", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_setVolume(jsi::Runtime &rt,
                                                                         react::TurboModule &turboModule,
                                                                         const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "setVolume", args, count);
}


static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_getCurrentTime(jsi::Runtime &rt,
                                                                              react::TurboModule &turboModule,
                                                                              const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getCurrentTime", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_setCurrentTime(jsi::Runtime &rt,
                                                                              react::TurboModule &turboModule,
                                                                              const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "setCurrentTime", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_getSpeed(jsi::Runtime &rt,
                                                                        react::TurboModule &turboModule,
                                                                        const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getSpeed", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_setSpeed(jsi::Runtime &rt,
                                                                        react::TurboModule &turboModule,
                                                                        const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "setSpeed", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_isPlaying(jsi::Runtime &rt,
                                                                         react::TurboModule &turboModule,
                                                                         const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "isPlaying", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_getNumberOfLoops(jsi::Runtime &rt,
                                                                                react::TurboModule &turboModule,
                                                                                const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getNumberOfLoops", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_setNumberOfLoops(jsi::Runtime &rt,
                                                                                react::TurboModule &turboModule,
                                                                                const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "setNumberOfLoops", args, count);
}

static jsi::Value __hostFunction_NativeSoundTurboModuleSpecJSI_getDuration(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "getDuration", args, count);
}

NativeSoundTurboModuleSpecJSI::NativeSoundTurboModuleSpecJSI(const ArkTSTurboModule::Context ctx,
                                                             const std::string name)
    : ArkTSTurboModule(ctx, name) {
    methodMap_["setActive"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_setActive};
    methodMap_["isLoaded"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_isLoaded};
    methodMap_["play"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_play};
    methodMap_["pause"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_pause};
    methodMap_["stop"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_stop};
    methodMap_["reset"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_reset};
    methodMap_["release"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_release};
    methodMap_["getVolume"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_getVolume};
    methodMap_["setVolume"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_setVolume};
    methodMap_["getCurrentTime"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_getCurrentTime};
    methodMap_["setCurrentTime"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_setCurrentTime};
    methodMap_["getSpeed"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_getSpeed};
    methodMap_["setSpeed"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_setSpeed};
    methodMap_["isPlaying"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_isPlaying};
    methodMap_["getNumberOfLoops"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_getNumberOfLoops};
    methodMap_["setNumberOfLoops"] = MethodMetadata{1, __hostFunction_NativeSoundTurboModuleSpecJSI_setNumberOfLoops};
    methodMap_["getDuration"] = MethodMetadata{0, __hostFunction_NativeSoundTurboModuleSpecJSI_getDuration};
}
