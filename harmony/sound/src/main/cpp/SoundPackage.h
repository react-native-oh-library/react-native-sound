#include "RNOH/Package.h"
#include "SoundTurboModule.h"

using namespace rnoh;
using namespace facebook;
class NativeSoundFactoryDelegate : public TurboModuleFactoryDelegate {
public:
    SharedTurboModule createTurboModule(Context ctx, const std::string &name) const override {
        if (name == "RNCSound") {
            return std::make_shared<NativeSoundTurboModuleSpecJSI>(ctx, name);
        }
        return nullptr;
    }
};

namespace rnoh {
    class SoundPackage : public Package {
    public:
        SoundPackage(Package::Context ctx) : Package(ctx) {}
        std::unique_ptr<TurboModuleFactoryDelegate> createTurboModuleFactoryDelegate() override {
            return std::make_unique<NativeSoundFactoryDelegate>();
        }
    };
} // namespace rnoh
