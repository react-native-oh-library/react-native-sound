#pragma once
#include "RNOH/ArkTSTurboModule.h"


namespace rnoh {
    class JSI_EXPORT NativeSoundTurboModuleSpecJSI : public ArkTSTurboModule {
    public:
        NativeSoundTurboModuleSpecJSI(const ArkTSTurboModule::Context ctx, const std::string name);
    };
} // namespace rnoh
