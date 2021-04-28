import { getDurationData } from "./helpers";
//T DO PROBABLY EXTEND THE ACtive effect class
export class TogglableEffect {

    name;
    settingsKey;
    icon;
    durationMinutes;
    durationTurns;
    flags;
    effects = [];

    constructor(
        name,
        settingsKey,
        icon,
        durationMinutes,
        durationTurns,
        flags,
        effects = []
    ) {
        this.name = name
        this.settingsKey = settingsKey
        this.icon = icon
        this.durationMinutes = durationMinutes
        this.durationTurns = durationTurns
        this.flags = flags
        this.effects = effects
    }

    effectDict(customEffectValue) {
        this.effects.forEach(effect => effect.value = typeof effect.value == "string" ? effect.value.replace("{value}", customEffectValue || 0) : effect.value)
        return {
            name: this.name,
            label: "Toggled Effect: " + this.name,
            icon: this.icon,
            duration: getDurationData(this.durationMinutes, eval(this.durationTurns || "")),
            flags: this.flags,
            changes: this.effects
        };
    }
}