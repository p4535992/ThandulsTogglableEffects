import { getDurationData, isDAEEnabled } from "./helpers";
import { getCanvas } from "./settings";
import { TogglableEffect } from "./TogglableEffect";

export class ThandulBuffsAndEffects {

    static effects = [
        new TogglableEffect("Bane", "Bane", "modules/ThandulsTogglableEffects/media/effects/bane.jpg", 1, undefined, {}, [
            {key: "data.bonuses.abilities.save", mode: 2, value: "-1d4"},
            {key: "data.bonuses.msak.attack", mode: 2, value: "-1d4"},
            {key: "data.bonuses.mwak.attack", mode: 2, value: "-1d4"},
            {key: "data.bonuses.rsak.attack", mode: 2, value: "-1d4"},
            {key: "data.bonuses.rwak.attack", mode: 2, value: "-1d4"},
        ]),
        new TogglableEffect("Barkskin", "Barkskin", "modules/ThandulsTogglableEffects/media/effects/barkskin.jpg", 60, undefined, {}, [
            {key: "data.attributes.ac.value", mode: 4, value: 16, priority: 60}
        ]),
        new TogglableEffect("Bless", "Bless", "modules/ThandulsTogglableEffects/media/effects/bless.jpg", 1, undefined, {}, [
            {key: "data.bonuses.abilities.save", mode: 2, value: "+1d4"},
            {key: "data.bonuses.msak.attack", mode: 2, value: "+1d4"},
            {key: "data.bonuses.mwak.attack", mode: 2, value: "+1d4"},
            {key: "data.bonuses.rsak.attack", mode: 2, value: "+1d4"},
            {key: "data.bonuses.rwak.attack", mode: 2, value: "+1d4"},
        ]),
        new TogglableEffect("Enlarge", "Enlarge", "modules/ThandulsTogglableEffects/media/effects/enlargereduce.jpg", 1, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+1d4"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+1d4"},
        ]),
        new TogglableEffect("Fly", "Fly", "modules/ThandulsTogglableEffects/media/effects/fly.jpg", 10, undefined, {}, [
            {key: "data.attributes.movement.fly", mode: 4, value: 60},
        ]),
        new TogglableEffect("Fortune's Favor", "Fortune's Favor", "modules/ThandulsTogglableEffects/media/effects/fortunes-favor.jpg", 60, undefined, {}, [
            {key: "data.attributes.inspiration", mode: 4, value: "1"},
        ]),
        new TogglableEffect("Gift of Alacrity", "Gift of Alacrity", "modules/ThandulsTogglableEffects/media/effects/gift-of-alacrity.jpg", 480, undefined, {}, [
            {key: "data.attributes.init.value", mode: 2, value: "+1d8"},
        ]),
        new TogglableEffect("Guidance", "Guidance", "modules/ThandulsTogglableEffects/media/effects/guidance.jpg", 1, undefined, {
            dae: {
                specialDuration: ["isCheck", "isSkill"]
            }
        }, [
            {key: "data.bonuses.abilities.check", mode: 2, value: "+1d4"},
            {key: "data.attributes.init.value", mode: 2, value: "+1d4"},
        ]),
        new TogglableEffect("Haste", "Haste", "modules/ThandulsTogglableEffects/media/effects/haste.jpg", 1, undefined, {}, [
            {key: "data.attributes.ac.value", mode: 2, value: "+2", priority: 80},
            {key: "data.attributes.movement.burrow", mode: 1, value: 2},
            {key: "data.attributes.movement.climb", mode: 1, value: 2},
            {key: "data.attributes.movement.fly", mode: 1, value: 2},
            {key: "data.attributes.movement.swim", mode: 1, value: 2},
            {key: "data.attributes.movement.walk", mode: 1, value: 2},
        ]),
        new TogglableEffect("Hunter's Mark 1h", "Hunter's Mark 1h", "modules/ThandulsTogglableEffects/media/effects/hunters-mark.jpg", 60, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+1d6"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+1d6"},
        ]),
        new TogglableEffect("Hunter's Mark 8h", "Hunter's Mark 8h", "modules/ThandulsTogglableEffects/media/effects/hunters-mark.jpg", 60 * 8, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+1d6"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+1d6"},
        ]),
        new TogglableEffect("Hunter's Mark 24h", "Hunter's Mark 24h", "modules/ThandulsTogglableEffects/media/effects/hunters-mark.jpg", 60 * 24, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+1d6"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+1d6"},
        ]),
        new TogglableEffect("Longstrider", "Longstrider", "modules/ThandulsTogglableEffects/media/effects/longstrider.jpg", 60, undefined, {}, [
            {key: "data.attributes.movement.burrow", mode: 2, value: "+10"},
            {key: "data.attributes.movement.climb", mode: 2, value: "+10"},
            {key: "data.attributes.movement.fly", mode: 2, value: "+10"},
            {key: "data.attributes.movement.swim", mode: 2, value: "+10"},
            {key: "data.attributes.movement.walk", mode: 2, value: "+10"},
        ]),
        new TogglableEffect("Mage Armor", "Mage Armor", "modules/ThandulsTogglableEffects/media/effects/mage-armor.jpg", 480, undefined, {}, [
            {key: "data.attributes.ac.value", mode: 4, value: "{value}"},
        ]),
        new TogglableEffect("Pass without Trace", "Pass without Trace", "modules/ThandulsTogglableEffects/media/effects/pass-without-trace.jpg", 60, undefined, {}, [
            {key: "data.skills.ste.mod", mode: 2, value: "+10"},
        ]),
        new TogglableEffect("Rage", "Rage", "modules/ThandulsTogglableEffects/media/effects/rage.jpg", 1, undefined, {}, []),
        new TogglableEffect("Reduce", "Reduce", "modules/ThandulsTogglableEffects/media/effects/enlargereduce.jpg", 1, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "-1d4"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "-1d4"},
        ]),
        new TogglableEffect("Shield", "Shield", "modules/ThandulsTogglableEffects/media/effects/shield.jpg", 1, undefined, {}, []),
        new TogglableEffect("Shield of Faith", "Shield of Faith", "modules/ThandulsTogglableEffects/media/effects/shield-of-faith.jpg", 1, undefined, {}, [
            {key: "data.attributes.ac.value", mode: 2, value: "+2"},
        ]),
        new TogglableEffect("Slow", "Slow", "modules/ThandulsTogglableEffects/media/effects/slow.jpg", 1, undefined, {}, [
            {key: "data.attributes.ac.value", mode: 2, value: "-2"},
            {key: "data.abilities.dex.save", mode: 2, value: "-2"},
        ]),
        new TogglableEffect("Favoured Enemy", "Favoured Enemy", "modules/ThandulsTogglableEffects/media/effects/favoured-enemy.png", 100, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+2"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+2"},
        ]),
        new TogglableEffect("Greater Favoured Enemy", "Greater Favoured Enemy", "modules/ThandulsTogglableEffects/media/effects/favoured-enemy.png", 100, undefined, {}, [
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+4"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+4"},
        ]),
        new TogglableEffect("Sharpshooter", "Sharpshooter", "modules/ThandulsTogglableEffects/media/effects/sharpshooter.jpg", 0.1, 1, {
            dae: { specialDuration: ["turnEnd"] }
        }, [
            {key: "data.bonuses.rwak.attack", mode: 2, value: "-5"},
            {key: "data.bonuses.rwak.damage", mode: 2, value: "+10"},
        ]),
        new TogglableEffect("Great Weapon Master", "Great Weapon Master", "modules/ThandulsTogglableEffects/media/effects/great-weapon-master.jpg", 0.1, 1, {
            dae: { specialDuration: ["turnEnd"] }
        }, [
            {key: "data.bonuses.mwak.attack", mode: 2, value: "-5"},
            {key: "data.bonuses.mwak.damage", mode: 2, value: "+10"},
        ]),
    ];

    static getEnabledEffects() {
        let enabledEffects = this.effects.filter(effect => game.settings.get("ThandulsTogglableEffects", "enabledEffects." + effect.settingsKey));
        if (game.settings.get("ThandulsTogglableEffects", "sortToggles")) {
            enabledEffects = enabledEffects.sort((lhs, rhs) => (lhs.name > rhs.name) ? 1 : ((rhs.name > lhs.name) ? -1 : 0));
        }
        return enabledEffects;
    }

    static handleEffectToggleEvent(toggleEvent) {
        for (const actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = ThandulBuffsAndEffects.getEffectForActor(actor, toggleEvent);
            if (!toggledEffect) { continue; }
            let effectToRemove = actor.data.effects.find(effect => effect.label == toggledEffect.label);
            effectToRemove ? actor.deleteEmbeddedEntity("ActiveEffect", effectToRemove._id) : actor.createEmbeddedEntity("ActiveEffect", toggledEffect);
        }
    }

    static getEffectForActor(actor, toggleEvent) {
        let togglableEffect = this.effects.find(effect => effect.name == toggleEvent.target.dataset.effectName);
        if (!togglableEffect) { return; }
        
        let effect;
        let customEffectValue;
        switch (togglableEffect.name) {
            case "Rage": effect = this.rage(actor); break;
            case "Shield": effect = this.shield(actor); break;
            case "Mage Armor": customEffectValue = isDAEEnabled() ? '13 + @data.abilities.dex.mod' : (13 + actor.data.data.abilities.dex.mod).toString();
            default: effect = togglableEffect.effectDict(customEffectValue); break;
        }
        effect.origin = "Actor." + actor.id;
        return effect;
    }

    static rage(actor) { 
        let rageData = {
            name: "Rage",
            label: "Toggled Effect: Rage",
            icon: "modules/ThandulsTogglableEffects/media/effects/rage.jpg",
            duration: getDurationData(1),
            changes: []
        };
        if (!actor) { return rageData; }
        const classItem = actor.data.items.find(item => item.type === "class" && item.name === "Barbarian");
        if (!classItem) { ui.notifications.warn("Selected actor is not a Barbarian"); return {}; }
        let rageDamageBonus = "+2";
        if (classItem.levels > 15) { rageDamageBonus = "+4" }
        else if (classItem.levels > 8) { rageDamageBonus = "+3" }
        rageData.changes.push(
            ...[
                {key: "data.bonuses.mwak.damage", mode: 2, value: rageDamageBonus},
                {key: "data.traits.dr.value", mode: 2, value: "bludgeoning"},
                {key: "data.traits.dr.value", mode: 2, value: "piercing"},
                {key: "data.traits.dr.value", mode: 2, value: "slashing"},
            ]
        );
        if(classItem.data.subclass === "Path of the Totem Warrior") {
            rageData.changes.push(
                ...[
                    {key: "data.traits.dr.value", mode: 2, value: "acid"},
                    {key: "data.traits.dr.value", mode: 2, value: "cold"},
                    {key: "data.traits.dr.value", mode: 2, value: "fire"},
                    {key: "data.traits.dr.value", mode: 2, value: "force"},
                    {key: "data.traits.dr.value", mode: 2, value: "lightning"},
                    {key: "data.traits.dr.value", mode: 2, value: "necrotic"},
                    {key: "data.traits.dr.value", mode: 2, value: "poison"},
                    {key: "data.traits.dr.value", mode: 2, value: "physical"},
                    {key: "data.traits.dr.value", mode: 2, value: "radiant"},
                    {key: "data.traits.dr.value", mode: 2, value: "thunder"}
                ]
            );
        }
        return rageData;
    }

    static shield(actor=undefined) {
        let currentCombat = game.combats.combats.find(combat => combat.combatants.map(combatant => combatant.actor.id).includes(actor != undefined ? actor.id : ''));
        let combatantCount = currentCombat != undefined ? currentCombat.combatants.length : 0;
        return {
            name: "Shield",
            label: "Toggled Effect: Shield",
            icon: "modules/ThandulsTogglableEffects/media/effects/shield.jpg",
            duration: getDurationData(0.1, combatantCount + 1),
            flags: {
                dae: {
                    specialDuration: ["turnStart"]
                }
            },
            changes: [
                {key: "data.attributes.ac.value", mode: 2, value: "5"},
              ],
        };
    }
}