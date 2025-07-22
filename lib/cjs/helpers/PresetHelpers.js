"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPreset = void 0;
/**
 * Returns true if and only if a given preset is already included in a list of presets
 * Check is done using referential equality
 * @param presets the list to check
 * @param preset the preset to check for
 */
const hasPreset = (presets, preset) => presets.some((presetListItem) => 
// Check regular preset equality
preset === presetListItem ||
    // Check PresetWithOptions equality
    (Object.prototype.hasOwnProperty.call(preset, 'preset') &&
        preset.preset === presetListItem));
exports.hasPreset = hasPreset;
//# sourceMappingURL=PresetHelpers.js.map