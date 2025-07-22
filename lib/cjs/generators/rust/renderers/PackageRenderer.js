"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUST_DEFAULT_PACKAGE_PRESET = exports.PackageRenderer = void 0;
const RustRenderer_1 = require("../RustRenderer");
const helpers_1 = require("../../../helpers");
const ModelNameConstrainer_1 = require("../constrainer/ModelNameConstrainer");
/**
 * Renderer for Rust's supporting files
 *
 * @extends RustRenderer
 */
class PackageRenderer extends RustRenderer_1.RustRenderer {
    defaultSelf() {
        return '';
    }
}
exports.PackageRenderer = PackageRenderer;
exports.RUST_DEFAULT_PACKAGE_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    lib({ inputModel, renderer, options }) {
        const modelNames = Object.values(inputModel.models).map((m) => m.name);
        const imports = renderer.renderBlock(modelNames
            .map((modelName) => {
            let mod = (0, ModelNameConstrainer_1.defaultModelNameConstraints)()({ modelName, options });
            mod = helpers_1.FormatHelpers.snakeCase(mod);
            return `
pub mod ${mod};
pub use self::${mod}::*;`;
        })
            .flat());
        return `#[macro_use]
extern crate serde;
extern crate serde_json;
${imports}`;
    },
    manifest({ packageOptions }) {
        const { packageName, packageVersion, homepage, authors, repository, description, license, edition } = packageOptions;
        const authorsString = authors.map((a) => `"${a}"`).join(',');
        return `[package]
name = "${packageName}"
version = "${packageVersion}"
authors = [${authorsString}]
homepage = "${homepage}"
repository = "${repository}"
license = "${license}"
description = "${description}"
edition = "${edition}"

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = { version="1", optional = true }

[dev-dependencies]

[features]
default = ["json"]
json = ["dep:serde_json"]`;
    }
};
//# sourceMappingURL=PackageRenderer.js.map