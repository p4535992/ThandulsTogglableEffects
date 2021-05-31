import { COMPENDIUM_PACK, COMPENDIUM_DAE_SRD_SPELLS, getCanvas } from './../settings';
import {retrieveEffectFromCompendium, isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk, ACTIVE_EFFECT_MODES} from '../helpers.js';
import { LANG_EFFECT } from '../helperLang';
//@ts-ignore
// import ATL from '../../../ATL/src/activeLighting.js';

export class ThandulSpells {

    static async getEnabledEffects() {
        let enabledEffects = [];

        enabledEffects.push(await this.bane().then(effect => {return effect;}) );
        enabledEffects.push(await this.barkskin().then(effect => {return effect;}) );
        enabledEffects.push(await this.bless().then(effect => {return effect;}) );
        enabledEffects.push(await this.enlarge().then(effect => {return effect;}) );
        enabledEffects.push(await this.fly().then(effect => {return effect;}) );
        enabledEffects.push(await this.fortunesFavor().then(effect => {return effect;}) );
        enabledEffects.push(await this.giftOfAlacrity().then(effect => {return effect;}) );
        enabledEffects.push(await this.guidance().then(effect => {return effect;}) );
        enabledEffects.push(await this.haste().then(effect => {return effect;}) );
        enabledEffects.push(await this.huntersMark(1).then(effect => {return effect;}) );
        enabledEffects.push(await this.huntersMark(8).then(effect => {return effect;}) );
        enabledEffects.push(await this.huntersMark(24).then(effect => {return effect;}) );
        enabledEffects.push(await this.longstrider().then(effect => {return effect;}) );
        enabledEffects.push(await this.mageArmor().then(effect => {return effect;}) );
        enabledEffects.push(await this.passWithoutTrace().then(effect => {return effect;}) );
        enabledEffects.push(await this.reduce().then(effect => {return effect;}) );
        enabledEffects.push(await this.shield().then(effect => {return effect;}) );
        enabledEffects.push(await this.shieldOfFaith().then(effect => {return effect;}) );
        enabledEffects.push(await this.slow().then(effect => {return effect;}) );
        return enabledEffects;
    }

    static async handleEffectToggleEvent(toggleEvent) {
        const updates = [];
        for (let token of getCanvas().tokens.controlled ) {
            const actor = token.actor;
        //for (let actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = await ThandulSpells.getEffectForActor(actor, toggleEvent).then(effect => {return effect;});
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
                // if(toggledEffect.label == LANG_EFFECT.spellEnlarge){
                //     updates.push({
                //         _id: token.id,
                //         height: (token.height * 0.5),
                //         width: (token.width * 0.5),
                //     });
                // }
                // else if(toggledEffect.label == LANG_EFFECT.spellReduce){
                //     updates.push({
                //         _id: token.id,
                //         height: (token.height * 2),
                //         width: (token.width * 2),
                //     });
                // }
                if(toggledEffect.label == LANG_EFFECT.spellFly){
                    updates.push({
                        _id: token.id,
                        elevation: parseFloat(String(parseFloat(getProperty(token.data, "elevation"))-1))
                    });
                }
            }else{
                //@ts-ignore
                actor.createEmbeddedDocuments("ActiveEffect", [toggledEffect]);
                // ========================
                // SPECIAL CASE TO INTEGRATE TO A ACTIVE EFFECTS
                // =======================
                // if(toggledEffect.label == LANG_EFFECT.spellEnlarge){
                //     updates.push({
                //         _id: token.id,
                //         height: (token.height * 2),
                //         width: (token.width * 2),
                //     });
                // }
                // else if(toggledEffect.label == LANG_EFFECT.spellReduce){
                //     updates.push({
                //         _id: token.id,
                //         height: (token.height * 0.5),
                //         width: (token.width * 0.5),
                //     });
                // }
                if(toggledEffect.label == LANG_EFFECT.spellFly){
                    updates.push({
                        _id: token.id,
                        elevation: parseFloat(String(parseFloat(getProperty(token.data, "elevation"))+1))
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
        let effect:any = {};
        switch(toggleEvent.target.dataset.effectName) {

            // ===================
            // SPELLS
            // ===================
            case LANG_EFFECT.spellBane: effect = await this.bane().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellBarkskin: effect = await this.barkskin().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellBless: effect = await this.bless().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellEnlarge: effect = await this.enlarge().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellFly: effect = await this.fly().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellFortunesFavor: effect = await this.fortunesFavor().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellGiftOfAlacrity: effect = await this.giftOfAlacrity().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellGuidance: effect = await this.guidance().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellHaste: effect = await this.haste().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellHuntersMark1h: effect = await this.huntersMark(1).then(effect => {return effect;}); break;
            case LANG_EFFECT.spellHuntersMark8h: effect = await this.huntersMark(8).then(effect => {return effect;}); break;
            case LANG_EFFECT.spellHuntersMark24h: effect = await this.huntersMark(24).then(effect => {return effect;}); break;
            case LANG_EFFECT.spellLongstrider: effect = await this.longstrider().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellMageArmor: effect = await this.mageArmor(actor.data.data.abilities.dex.mod).then(effect => {return effect;}); break;
            case LANG_EFFECT.spellPassWithoutTrace: effect = await this.passWithoutTrace().then(effect => {return effect;}); break;

            case LANG_EFFECT.spellReduce: effect = await this.reduce().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellShield: effect = await this.shield(actor).then(effect => {return effect;}); break;
            case LANG_EFFECT.spellShieldOfFaith: effect = await this.shieldOfFaith().then(effect => {return effect;}); break;
            case LANG_EFFECT.spellSlow: effect = await this.slow().then(effect => {return effect;}); break;

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

    static async bane() {
        // return {
        //     name: "Bane",
        //     label: "Toggled Effect: Bane",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/bane.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.bonuses.abilities.save", mode: 2, value: "-1d4"},
        //         {key: "data.bonuses.msak.attack", mode: 2, value: "-1d4"},
        //         {key: "data.bonuses.mwak.attack", mode: 2, value: "-1d4"},
        //         {key: "data.bonuses.rsak.attack", mode: 2, value: "-1d4"},
        //         {key: "data.bonuses.rwak.attack", mode: 2, value: "-1d4"},
        //     ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellBane)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async barkskin() {
        // return {
        //     name: "Barkskin",
        //     label: "Toggled Effect: Barkskin",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/barkskin.jpg",
        //     duration: getDurationData(60),
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 4, value: 16, priority: 60},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellBarkskin)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async bless() {
        // return {
        //     name: "Bless",
        //     label: "Toggled Effect: Bless",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/bless.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.bonuses.abilities.save", mode: 2, value: "1d4"},
        //         {key: "data.bonuses.msak.attack", mode: 2, value: "1d4"},
        //         {key: "data.bonuses.mwak.attack", mode: 2, value: "1d4"},
        //         {key: "data.bonuses.rsak.attack", mode: 2, value: "1d4"},
        //         {key: "data.bonuses.rwak.attack", mode: 2, value: "1d4"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellBless)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async enlarge() {
        // return {
        //     name: "Enlarge",
        //     label: "Toggled Effect: Enlarge",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/enlargereduce.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: "1d4"},
        //         {key: "data.bonuses.rwak.damage", mode: 2, value: "1d4"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellEnlarge)
        .then(effect => {
            return effect;
        });
        if(effect){
            if(effect.changes){
                effect.changes.push( {key: "ATL.height", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "2", priority: 40});
                effect.changes.push( {key: "ATL.width", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "2", priority: 40});
            }else{
                //@ts-ignore
                effect.effects[0].changes.push( {key: "ATL.height", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "2", priority: 40});
                //@ts-ignore
                effect.effects[0].changes.push( {key: "ATL.width", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "2", priority: 40});
            }
        }
        return effect;
    }

    static async fly() {
        // return {
        //     name: "Fly",
        //     label: "Toggled Effect: Fly",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/fly.jpg",
        //     duration: getDurationData(10),
        //     changes: [
        //         {key: "data.attributes.movement.fly", mode: 4, value: 60},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellFly)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async fortunesFavor() {
        // return {
        //     name: "Fortune's Favor",
        //     label: "Toggled Effect: Fortune's Favor",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/fortunes-favor.jpg",
        //     duration: getDurationData(60),
        //     changes: [
        //         {key: "data.attributes.inspiration", mode: 4, value: "1"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellFortunesFavor)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async giftOfAlacrity() {
        // return {
        //     name: "Gift of Alacrity",
        //     label: "Toggled Effect: Gift of Alacrity",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/gift-of-alacrity.jpg",
        //     duration: getDurationData(480),
        //     changes: [
        //         {key: "data.attributes.init.value", mode: 2, value: "1d8"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellGiftOfAlacrity)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async guidance() {
        // return {
        //     name: "Guidance",
        //     label: "Toggled Effect: Guidance",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/guidance.jpg",
        //     duration: getDurationData(1),
                // flags: {
                //     dae: {
                //         specialDuration: ["isCheck", "isSkill"]
                //     }
                // },
        //     changes: [
        //         {key: "data.bonuses.abilities.check", mode: 2, value: "1d4"},
        //         {key: "data.attributes.init.value", mode: 2, value: "+1d4"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellGuidance)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async haste() {
        // return {
        //     name: "Haste",
        //     label: "Toggled Effect: Haste",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/haste.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 2, value: 2, priority: 80},
        //         {key: "data.attributes.movement.burrow", mode: 1, value: 2},
        //         {key: "data.attributes.movement.climb", mode: 1, value: 2},
        //         {key: "data.attributes.movement.fly", mode: 1, value: 2},
        //         {key: "data.attributes.movement.swim", mode: 1, value: 2},
        //         {key: "data.attributes.movement.walk", mode: 1, value: 2},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellHaste)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async huntersMark(durationHours) {
        // return {
        //     name: "Hunter's Mark " + durationHours + "h",
        //     label: "Toggled Effect: Hunter's Mark",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/hunters-mark.jpg",
        //     duration: getDurationData(60 * durationHours),
        //     changes: [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: "1d6"},
        //         {key: "data.bonuses.rwak.damage", mode: 2, value: "1d6"},
        //       ],
        // };
        let effect;
        if(durationHours==1){
            effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellHuntersMark1h)
            .then(effect => {
                return effect;
            });
        }else if(durationHours==8){
            effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellHuntersMark8h)
            .then(effect => {
                return effect;
            });
        }else if(durationHours==24){
            effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellHuntersMark24h)
            .then(effect => {
                return effect;
            });
        }else{
            effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellHuntersMark1h)
            .then(effect => {
                return effect;
            });
        }
        return effect;
    }

    static async longstrider() {
        // return {
        //     name: "Longstrider",
        //     label: "Toggled Effect: Longstrider",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/longstrider.jpg",
        //     duration: getDurationData(60),
        //     changes: [
        //         {key: "data.attributes.movement.burrow", mode: 2, value: 10},
        //         {key: "data.attributes.movement.climb", mode: 2, value: 10},
        //         {key: "data.attributes.movement.fly", mode: 2, value: 10},
        //         {key: "data.attributes.movement.swim", mode: 2, value: 10},
        //         {key: "data.attributes.movement.walk", mode: 2, value: 10},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellLongstrider)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async mageArmor(dexMod=0) {
        // return {
        //     name: "Mage Armor",
        //     label: "Toggled Effect: Mage Armor",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/mage-armor.jpg",
        //     duration: getDurationData(480),
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 4, value: isDAEEnabled() ? '13 + @data.abilities.dex.mod' : 13 + dexMod},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellMageArmor)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async passWithoutTrace() {
        // return {
        //     name: "Pass without Trace",
        //     label: "Toggled Effect: Pass without Trace",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/pass-without-trace.jpg",
        //     duration: getDurationData(60),
        //     changes: [
        //         {key: "data.skills.ste.mod", mode: 2, value: "10"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellPassWithoutTrace)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async reduce() {
        // return {
        //     name: "Reduce",
        //     label: "Toggled Effect: Reduce",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/enlargereduce.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: "-1d4"},
        //         {key: "data.bonuses.rwak.damage", mode: 2, value: "-1d4"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.spellReduce)
        .then(effect => {
            return effect;
        });
        if(effect){
            if(effect.changes){
                effect.changes.push( {key: "ATL.height", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5", priority: 40});
                effect.changes.push( {key: "ATL.width", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5", priority: 40});
            }else{
                //@ts-ignore
                effect.effects[0].changes.push( {key: "ATL.height", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5", priority: 40});
                //@ts-ignore
                effect.effects[0].changes.push( {key: "ATL.width", mode: ACTIVE_EFFECT_MODES.MULTIPLY, value: "0.5", priority: 40});  
            }
        }
        return effect;
    }

    static async shield(actor=undefined) {
        // let currentCombat = game.combats.combats.filter(combat => combat.combatants.map(combatant => combatant.actor.id).includes(actor != undefined ? actor.id : ''))[0]
        // let combatantCount = currentCombat != undefined ? currentCombat.combatants.length : 0;
        // return {
        //     name: "Shield",
        //     label: "Toggled Effect: Shield",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/shield.jpg",
        //     duration: getDurationData(0.1, combatantCount + 1),
        //     flags: {
        //         dae: {
        //             specialDuration: ["turnStart"]
        //         }
        //     },
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 2, value: "5"},
        //     ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellShield)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async shieldOfFaith() {
        // return {
        //     name: "Shield of Faith",
        //     label: "Toggled Effect: Shield of Faith",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/shield-of-faith.jpg",
        //     duration: getDurationData(10),
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 2, value: "2"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellShieldOfFaith)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async slow() {
        // return {
        //     name: "Slow",
        //     label: "Toggled Effect: Slow",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/slow.jpg",
        //     duration: getDurationData(1),
        //     changes: [
        //         {key: "data.attributes.ac.value", mode: 2, value: "-2"},
        //         {key: "data.abilities.dex.save", mode: 2, value: "-2"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_SPELLS,LANG_EFFECT.spellSlow)
        .then(effect => {
            return effect;
        });
        return effect;
    }
}
