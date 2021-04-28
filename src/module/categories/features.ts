import { COMPENDIUM_DAE_SRD_FEATS, COMPENDIUM_PACK, getCanvas } from './../settings';
import { LANG_EFFECT } from '../helperLang.js';
import {retrieveEffectFromCompendium, isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk} from '../helpers.js';

export class ThandulFeatures {

    static async getEnabledEffects() {
        let enabledEffects = [];
        // if (game.settings.get(MODULE_NAME, "enabledEffects.FavouredEnemy")) {
            enabledEffects.push(
                await this.favouredEnemy().then(effect => {return effect;})
            );
        // }
        // if (game.settings.get(MODULE_NAME, "enabledEffects.GreaterFavouredEnemy")) {
            enabledEffects.push(
                await this.greaterFavouredEnemy().then(effect => {return effect;})
            );
        // }
        // if (game.settings.get(MODULE_NAME, "enabledEffects.Rage")) {
            enabledEffects.push(
                await this.rage().then(effect => {return effect;})
            );
        // }
        enabledEffects.push(
          await this.ragePathOfTheTotemWarrior().then(effect => {return effect;})
        );
        enabledEffects.push(
            await this.sharpShooter().then(effect => {return effect;})
        );
        enabledEffects.push(
            await this.greaterWeaponMastery().then(effect => {return effect;})
        );
        return enabledEffects;
    }

    static async handleEffectToggleEvent(toggleEvent) {
        const updates = [];
        for (let token of getCanvas().tokens.controlled ) {
            const actor = token.actor;
        // for (const actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = await ThandulFeatures.getEffectForActor(actor, toggleEvent).then(effect => {return effect;});
            if (!toggledEffect) {
                continue;
            }
            if(toggledEffect.effects){
                toggledEffect = toggledEffect.effects.find(effect => effect.label == toggledEffect.label);
            }
            let effectToRemove = actor.data.effects.find(effect => effect.label == toggledEffect.label);
            if(effectToRemove){
                actor.deleteEmbeddedEntity("ActiveEffect", effectToRemove._id);
            }else{
                actor.createEmbeddedEntity("ActiveEffect", toggledEffect);
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
          // FEATURES
          // ===================
          case LANG_EFFECT.featureFavouredEnemy: effect = await this.favouredEnemy().then(effect => {return effect;}); break;
          case LANG_EFFECT.featureGreaterFavouredEnemy: effect = this.greaterFavouredEnemy().then(effect => {return effect;}); break;
          case LANG_EFFECT.featureRage: effect = await this.rage().then(effect => {return effect;}); break;
          case LANG_EFFECT.featureRagePathOfTheTotemWarrior: effect = await this.ragePathOfTheTotemWarrior().then(effect => {return effect;}); break;

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

    static async favouredEnemy() {
        // return {
        //     name: "Favoured Enemy",
        //     label: "Toggled Effect: Favoured Enemy",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/favoured-enemy.png",
        //     duration: getDurationData(100),
        //     changes: [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: "2"},
        //         {key: "data.bonuses.rwak.damage", mode: 2, value: "2"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.featureFavouredEnemy)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async greaterFavouredEnemy() {
        // return {
        //     name: "Greater Favored Enemy",
        //     label: "Toggled Effect: Greater Favoured Enemy",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/favoured-enemy.png",
        //     duration: getDurationData(100),
        //     changes: [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: "4"},
        //         {key: "data.bonuses.rwak.damage", mode: 2, value: "4"},
        //       ],
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.featureGreaterFavouredEnemy)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async rage() {
        // let rageData = {
        //     name: "Rage",
        //     label: "Toggled Effect: Rage",
        //     icon: "modules/ThandulsTogglableEffects/media/effects/rage.jpg",
        //     duration: getDurationData(1),
        //     changes: []
        // };
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_DAE_SRD_FEATS,LANG_EFFECT.featureRage)
        .then(effect => {
            return effect;
        });
        // if (!classItem) { ui.notifications.warn("Selected actor is not a Barbarian"); return {}; }
        // let rageDamageBonus = "+2";
        // if (classItem.levels > 15) { rageDamageBonus = "+4" }
        // else if (classItem.levels > 8) { rageDamageBonus = "+3" }
        // rageData.changes.push(
        //     [
        //         {key: "data.bonuses.mwak.damage", mode: 2, value: rageDamageBonus},
        //         {key: "data.traits.dr.value", mode: 2, value: "bludgeoning"},
        //         {key: "data.traits.dr.value", mode: 2, value: "piercing"},
        //         {key: "data.traits.dr.value", mode: 2, value: "slashing"},
        //     ]
        // );
        // if(classItem.data.subclass === "Path of the Totem Warrior") {
        //     // effect.changes.push(
        //     //     ...[
        //     //         {key: "data.traits.dr.value", mode: 2, value: "acid"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "cold"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "fire"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "force"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "lightning"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "necrotic"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "poison"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "physical"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "radiant"},
        //     //         {key: "data.traits.dr.value", mode: 2, value: "thunder"}
        //     //     ]
        //     // );
        //     effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,"Rage (Path of the Totem Warrior)")
        //     .then(effect => {
        //         return effect;
        //     });
        // }
        return effect;
    }

    static async ragePathOfTheTotemWarrior() {
      let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.featureRagePathOfTheTotemWarrior)
          .then(effect => {
              return effect;
          });
      return effect;
    }

    static async sharpShooter(){
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.featureSharpshooter)
        .then(effect => {
            return effect;
        });
        return effect;
    }

    static async greaterWeaponMastery(){
        let effect = await retrieveEffectFromCompendium(COMPENDIUM_PACK,LANG_EFFECT.featureGreatWeaponMaster)
        .then(effect => {
            return effect;
        });
        return effect;
    }
  
}
