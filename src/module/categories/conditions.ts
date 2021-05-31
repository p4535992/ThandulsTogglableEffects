import { COMPENDIUM_LINGERING_INJURIES_ITEMS, getCanvas } from './../settings';
import {retrieveEffectFromCompendium, isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk, getDurationDataForEffect, MACRO_CONDITIONAL_VISIBILITY } from '../helpers.js';
import { i18n } from '../../ThandulsTogglableEffects';
import { ACTIVE_EFFECT_MODES, getRandomItemFromCompendium } from '../helpers';
import { LANG_EFFECT } from '../helperLang.js';
//@ts-ignore
// import ATL from '../../../ATL/src/activeLighting.js';

export class ThandulConditions {

    static async getEnabledEffects() {
        let enabledEffects = [];
        enabledEffects.push(this.almostdead());
        enabledEffects.push(this.blinded());
        enabledEffects.push(this.charmed());
        enabledEffects.push(this.dead());
        enabledEffects.push(this.deafened());
        enabledEffects.push(this.diseased());
        enabledEffects.push(this.exhaustion1());
        enabledEffects.push(this.exhaustion2());
        enabledEffects.push(this.exhaustion3());
        enabledEffects.push(this.exhaustion4());
        enabledEffects.push(this.exhaustion5());
        enabledEffects.push(this.frightened());
        enabledEffects.push(this.grappled());
        enabledEffects.push(this.incapacitated());
        enabledEffects.push(this.invisible());
        enabledEffects.push(this.paralyzed());
        enabledEffects.push(this.petrified());
        enabledEffects.push(this.poisoned());
        enabledEffects.push(this.prone());
        enabledEffects.push(this.restrained());
        enabledEffects.push(this.stunned());
        enabledEffects.push(this.unconscious());
        // enabledEffects.push(this.wounded());
        enabledEffects.push(
            await this.wounded().then(effect => {return effect;})
        );

        return enabledEffects;
    }

    static async handleEffectToggleEvent(toggleEvent) {
        const updates = [];
        for (let token of getCanvas().tokens.controlled ) {
            const actor = token.actor;
        //for (let actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = await ThandulConditions.getEffectForActor(actor, toggleEvent);
            if (!toggledEffect) { continue; }
            if(toggledEffect.effects){
                toggledEffect = toggledEffect.effects.find(effect => effect.label == toggledEffect.label);
            }
            //@ts-ignore
            let effectToRemove = Array.from(actor.data.effects.values()).find(effect => effect.data.label == toggledEffect.label);
            if(effectToRemove){
                //@ts-ignore
                actor.deleteEmbeddedDocuments("ActiveEffect", [effectToRemove.id])

                // ========================
                // SPECIAL CASE TO INTEGRATE TO A ACTIVE EFFECTS
                // =======================
                if(toggledEffect.label == LANG_EFFECT.conditionBlinded){
                    updates.push({
                      _id: token.id,
                      vision: true,
                      dimSight: 10,
                      brightSight: 5
                    });
                }
                else if(toggledEffect.label == LANG_EFFECT.conditionInvisible){
                    updates.push({
                      _id: token.id,
                      hidden: false
                    });
                }
            } else {
                //@ts-ignore
                actor.createEmbeddedDocuments("ActiveEffect", [toggledEffect]);

                // ========================
                // SPECIAL CASE TO INTEGRATE TO A ACTIVE EFFECTS
                // =======================
                if(toggledEffect.label == LANG_EFFECT.conditionBlinded){
                    updates.push({
                      _id: token.id,
                      vision: true,
                      dimSight: 0,
                      brightSight: 0
                    });
                }
                else if(toggledEffect.label == LANG_EFFECT.conditionInvisible){
                    updates.push({
                      _id: token.id,
                      hidden: true
                    });
                }
            }
        }
        if(updates.length>0){
            // use canvase.tokens.updateMany instead of token.update to prevent race conditions
            // (meaning not all updates will be persisted and might only show locally)
            getCanvas().tokens.updateMany(updates);
        }
    }

    static async getEffectForActor(actor, toggleEvent) {
        let togglableEffect = actor.effects.find(effect => effect.name == toggleEvent.target.dataset.effectName);
        if (!togglableEffect) { 
            return; 
        }

        let effect:any = {};
        let customEffectValue;

        switch(toggleEvent.target.dataset.effectName) {
            case LANG_EFFECT.conditionAlmostdead: effect = this.almostdead(); break;
            case LANG_EFFECT.conditionBlinded: effect = this.blinded(); break;
            case LANG_EFFECT.conditionCharmed: effect = this.charmed(); break;
            case LANG_EFFECT.conditionDead: effect = this.dead(); break;
            case LANG_EFFECT.conditionDeafened: effect = this.deafened(); break;
            case LANG_EFFECT.conditionDiseased: effect = this.diseased(); break;
            case LANG_EFFECT.conditionExhausted1: effect = this.exhaustion1(); break;
            case LANG_EFFECT.conditionExhausted2: effect = this.exhaustion2(); break;
            case LANG_EFFECT.conditionExhausted3: effect = this.exhaustion3(); break;
            case LANG_EFFECT.conditionExhausted4: effect = this.exhaustion4(); break;
            case LANG_EFFECT.conditionExhausted5: effect = this.exhaustion5(); break;
            case LANG_EFFECT.conditionFrightened: effect = this.frightened(); break;
            case LANG_EFFECT.conditionGrappled: effect = this.grappled(); break;
            case LANG_EFFECT.conditionIncapacitated: effect = this.incapacitated(); break;
            case LANG_EFFECT.conditionInvisible: effect = this.invisible(); break;
            case LANG_EFFECT.conditionParalyzed: effect = this.paralyzed(); break;
            case LANG_EFFECT.conditionPetrified: effect = this.petrified(); break;
            case LANG_EFFECT.conditionPoisoned: effect = this.poisoned(); break;
            case LANG_EFFECT.conditionProne: effect = this.prone(); break;
            case LANG_EFFECT.conditionRestrained: effect = this.restrained(); break;
            case LANG_EFFECT.conditionStunned: effect = this.stunned(); break;
            case LANG_EFFECT.conditionUnconscious: effect = this.unconscious(); break;
            case LANG_EFFECT.conditionWounded: effect = await this.wounded(); break;
            default: return undefined;
        }
        effect.origin = "Actor." + actor.id;
        return effect;
    }

    //value="0" Custom
    //value="1" Multiply
    //value="2" Add
    //value="3" Downgrade
    //value="4" Upgrade
    //value="5" Override

    static almostdead() {
        let effect = {
            name: LANG_EFFECT.conditionAlmostdead,
            label: LANG_EFFECT.conditionAlmostdead,
            icon: "modules/ThandulsTogglableEffects/media/conditions/almostdead.svg",
            duration: getDurationDataForEffect(),
            changes: [
            ],
        };
        return effect;
    }

    static blinded() {
        let effect = {
            name: LANG_EFFECT.conditionBlinded,
            label: LANG_EFFECT.conditionBlinded,
            icon: "modules/ThandulsTogglableEffects/media/conditions/blinded.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.attributes.senses.darkvision", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.senses.truesight", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "flags.midi-qol.disadvantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.advantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.perfect-vision.sightLimit", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "ATL.dimSight", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "ATL.brightSight", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"}
            ],
        };
        return effect;
    }

    static charmed() {
        let effect = {
            name: LANG_EFFECT.conditionCharmed,
            label: LANG_EFFECT.conditionCharmed,
            icon: "modules/ThandulsTogglableEffects/media/conditions/charmed.svg",
            duration: getDurationDataForEffect(),
            changes: [
            ],
        };
        return effect;
    }

    static dead() {
        let effect = {
            name: LANG_EFFECT.conditionDead,
            label: LANG_EFFECT.conditionDead,
            icon: "modules/ThandulsTogglableEffects/media/conditions/dead.svg",
            duration: getDurationDataForEffect(),
            changes: [
            ],
        };
        return effect;
    }

    static deafened() {
        let effect = {
            name: LANG_EFFECT.conditionDeafened,
            label: LANG_EFFECT.conditionDeafened,
            icon: "modules/ThandulsTogglableEffects/media/conditions/deafened.svg",
            duration: getDurationDataForEffect(),
            changes: [
            ],
        };
        return effect;
    }

    static diseased() {
        let effect = {
            name: LANG_EFFECT.conditionDiseased,
            label: LANG_EFFECT.conditionDiseased,
            icon: "modules/ThandulsTogglableEffects/media/conditions/diseased.svg",
            duration: getDurationDataForEffect(),
            changes: [
            ],
        };
        return effect;
    }

    static exhaustion1() {
        let effect = {
            name: LANG_EFFECT.conditionExhausted1,
            label: LANG_EFFECT.conditionExhausted1,
            icon: "modules/ThandulsTogglableEffects/media/conditions/exhaustion1.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.ability.check.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "macro.execute", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "CUB-Exhausted"},
            ],
        };
        return effect;
    }

    static exhaustion2() {
        let effect = {
            name: LANG_EFFECT.conditionExhausted2,
            label: LANG_EFFECT.conditionExhausted2,
            icon: "modules/ThandulsTogglableEffects/media/conditions/exhaustion2.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.ability.check.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                // {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.walk)/2)"},
                // {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.climb)/2)"},
                // {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.swim)/2)"},
                // {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.burrow)/2)"},
                // {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.fly)/2)"}
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"}
            ],
        };
        return effect;
    }

    static exhaustion3() {
        let effect = {
            name: LANG_EFFECT.conditionExhausted3,
            label: LANG_EFFECT.conditionExhausted3,
            icon: "modules/ThandulsTogglableEffects/media/conditions/exhaustion3.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.ability.check.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                // {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.walk)/2)"},
                // {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.climb)/2)"},
                // {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.swim)/2)"},
                // {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.burrow)/2)"},
                // {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.fly)/2)"},
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},

                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.disadvantage.ability.save.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ],
        };
        return effect;
    }

    static exhaustion4() {
        let effect = {
            name: LANG_EFFECT.conditionExhausted4,
            label: LANG_EFFECT.conditionExhausted4,
            icon: "modules/ThandulsTogglableEffects/media/conditions/exhaustion4.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.ability.check.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                // {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.walk)/2)"},
                // {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.climb)/2)"},
                // {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.swim)/2)"},
                // {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.burrow)/2)"},
                // {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.fly)/2)"},
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},

                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.disadvantage.ability.save.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                //{key: "data.attributes.hp.max", mode: ACTIVE_EFFECT_MODES.ADD, value: "-ceil((@attributes.hp.max)/2)"}
                {key: "data.attributes.hp.max", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"}

            ],
        };
        return effect;
    }

    static exhaustion5() {
        let effect = {
            name: LANG_EFFECT.conditionExhausted5,
            label: LANG_EFFECT.conditionExhausted5,
            icon: "modules/ThandulsTogglableEffects/media/conditions/exhaustion5.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.ability.check.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                // {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.walk)/2)"},
                // {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.climb)/2)"},
                // {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.swim)/2)"},
                // {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.burrow)/2)"},
                // {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "((@attributes.movement.fly)/2)"},
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"},

                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.disadvantage.ability.save.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},

                //{key: "data.attributes.hp.max", mode: ACTIVE_EFFECT_MODES.ADD, value: "-ceil((@attributes.hp.max)/2)"}
                {key: "data.attributes.hp.max", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5"}
            ],
        };
        return effect;
    }

    static frightened() {
        let effect = {
            name: LANG_EFFECT.conditionFrightened,
            label: LANG_EFFECT.conditionFrightened,
            icon: "modules/ThandulsTogglableEffects/media/conditions/frightened.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ],
        };
        return effect;
    }

    static grappled() {
        let effect = {
            name: LANG_EFFECT.conditionGrappled,
            label: LANG_EFFECT.conditionGrappled,
            icon: "modules/ThandulsTogglableEffects/media/conditions/grappled.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ],
        };
        return effect;
    }

    static incapacitated() {
        let effect = {
            name: LANG_EFFECT.conditionIncapacitated,
            label: LANG_EFFECT.conditionIncapacitated,
            icon: "modules/ThandulsTogglableEffects/media/conditions/incapacitated.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"}
            ],
        };
        return effect;
    }

    static invisible() {
        let effect = {
            name: LANG_EFFECT.conditionInvisible,
            label: LANG_EFFECT.conditionInvisible,
            icon: "modules/ThandulsTogglableEffects/media/conditions/invisible.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "macro.execute", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: MACRO_CONDITIONAL_VISIBILITY.TOGGLE_INVISIBLE} // This is  a macro from 'ConditionalVisibility' module
                // Macro used (script): token.update({"hidden": !token.data.hidden})
            ]
        };
        return effect;
    }

    static paralyzed() {
        let effect = {
            name: LANG_EFFECT.conditionParalyzed,
            label: LANG_EFFECT.conditionParalyzed,
            icon: "modules/ThandulsTogglableEffects/media/conditions/paralyzed.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.fail.ability.save.str", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.fail.ability.save.dex", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.advantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.critical.mwak", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.critical.msak", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "macro.tokenMagic", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "waves"}
            ]
        };
        return effect;
    }

    static petrified() {
        let effect = {
            name: LANG_EFFECT.conditionPetrified,
            label: LANG_EFFECT.conditionPetrified,
            icon: "modules/ThandulsTogglableEffects/media/conditions/petrified.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "acid"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "bludgeoning"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "cold"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "fire"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "force"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "lightning"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "necrotic"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "non-magical physical"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "piercing"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "radiant"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "slashing"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "thunder"},
                {key: "data.traits.dr.value", mode: ACTIVE_EFFECT_MODES.CUSTOM, value: "spell damage"},
                {key: "data.traits.ci.value", mode: ACTIVE_EFFECT_MODES.ADD, value: "poisoned"},
                {key: "data.traits.ci.value", mode: ACTIVE_EFFECT_MODES.ADD, value: "diseased"},
                {key: "data.traits.di.value", mode: ACTIVE_EFFECT_MODES.ADD, value: "poison"},
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "flags.midi-qol.fail.ability.save.str", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.fail.ability.save.dex", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static poisoned() {
        let effect = {
            name: LANG_EFFECT.conditionPoisoned,
            label: LANG_EFFECT.conditionPoisoned,
            icon: "modules/ThandulsTogglableEffects/media/conditions/poisoned.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.disadvantage.ability", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static prone() {
        let effect = {
            name: LANG_EFFECT.conditionProne,
            label: LANG_EFFECT.conditionProne,
            icon: "modules/ThandulsTogglableEffects/media/conditions/prone.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "flags.midi-qol.disadvantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static restrained() {
        let effect = {
            name: LANG_EFFECT.conditionRestrained,
            label: LANG_EFFECT.conditionRestrained,
            icon: "modules/ThandulsTogglableEffects/media/conditions/restrained.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "flags.midi-qol.grants.advantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.disadvantage.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.fail.ability.save.str", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static stunned() {
        let effect = {
            name: LANG_EFFECT.conditionStunned,
            label: LANG_EFFECT.conditionStunned,
            icon: "modules/ThandulsTogglableEffects/media/conditions/stunned.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "flags.midi-qol.fail.ability.save.str", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.fail.ability.save.dex", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.advantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static unconscious() {
        let effect = {
            name: LANG_EFFECT.conditionUnconscious,
            label: LANG_EFFECT.conditionUnconscious,
            icon: "modules/ThandulsTogglableEffects/media/conditions/unconscious.svg",
            duration: getDurationDataForEffect(),
            changes: [
                {key: "data.attributes.movement.walk", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.climb", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.swim", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.burrow", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "data.attributes.movement.fly", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "0"},
                {key: "flags.midi-qol.fail.ability.save.str", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.fail.ability.save.dex", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"},
                {key: "flags.midi-qol.grants.advantage.attack.all", mode: ACTIVE_EFFECT_MODES.OVERRIDE, value: "1"}
            ]
        };
        return effect;
    }

    static async wounded() {
        let item = await getRandomItemFromCompendium(COMPENDIUM_LINGERING_INJURIES_ITEMS);
        if(!item){
            let effect = {
                name: LANG_EFFECT.conditionWounded,
                label: LANG_EFFECT.conditionWounded,
                icon: "modules/ThandulsTogglableEffects/media/conditions/wounded.svg",
                duration: getDurationDataForEffect(),
                changes: [
                ]
            };
            return effect;
        }else{
            let img = "modules/ThandulsTogglableEffects/media/conditions/wounded.svg";
            if(!item.data['img'] && item.data['img'] == "icons/svg/mystery-man.svg"){
                img = item.data['img'];
            }
            let effect = {
                name: LANG_EFFECT.conditionWounded,
                label: item.data.name,
                icon: img,
                duration: getDurationDataForEffect(),
                changes: [
                ]
            };
            return effect;
        }

    }


}
