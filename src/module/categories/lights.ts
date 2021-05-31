import {retrieveEffectFromCompendium, isDAEEnabled, isBarbarianClassItem, getDurationData, arrayChunk, getDurationDataForEffect} from '../helpers.js';
import { i18n } from '../../ThandulsTogglableEffects';
import { getCanvas } from '../settings.js';
export class ThandulLights {

    static getEnabledEffects() {
        let enabledEffects = [];
        
        // enabledEffects.push(this.blinded());
        
        return enabledEffects;
    }
    
    static handleEffectToggleEvent(toggleEvent) {
        const updates = [];
        for (let token of getCanvas().tokens.controlled ) {
            const actor = token.actor;
        // for (const actor of getCanvas().tokens.controlled.map(token => token.actor)) {
            let toggledEffect = ThandulLights.getEffectForActor(actor, toggleEvent);
            if (!toggledEffect) { continue; }
            if(toggledEffect.effects){
                toggledEffect = toggledEffect.effects.find(effect => effect.label == toggledEffect.label);
            }
            //@ts-ignore
            let effectToRemove = Array.from(actor.data.effects.values()).find(effect => effect.data.label == toggledEffect.label);
            if(effectToRemove){ 
                //@ts-ignore
                actor.deleteEmbeddedDocuments("ActiveEffect", [effectToRemove.id])
            }else{
                //@ts-ignore
                actor.createEmbeddedDocuments("ActiveEffect", [toggledEffect]);
            }          
        }
        if(updates.length>0){
            // use canvase.tokens.updateMany instead of token.update to prevent race conditions
            // (meaning not all updates will be persisted and might only show locally)
            getCanvas().tokens.updateMany(updates);
        }
    }  

    static getEffectForActor(actor, toggleEvent) {
        let effect:any = {};
        switch(toggleEvent.target.dataset.effectName) {

            // ===================
            // LIGHTS
            // ===================

            // case "Blinded": effect = this.blinded(); break;
           
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

    // static blinded() {
    //     let effect = {
    //         name: i18n("EFFECT.StatusBlinded"),
    //         label: i18n("EFFECT.StatusBlinded"),
    //         icon: "modules/ThandulsTogglableEffects/media/conditions/blinded.svg",
    //         duration: getDurationDataForEffect(),
    //         changes: [
    //             {key: "data.attributes.senses.darkvision", mode: 5, value: "0"},
    //             {key: "data.attributes.senses.truesight", mode: 5, value: "0"},
    //             {key: "flags.midi-qol.disadvantage.attack.all", mode: 5, value: "1"},
    //             {key: "flags.midi-qol.grants.advantage.attack.all", mode: 5, value: "1"},
    //             {key: "flags.perfect-vision.sightLimit", mode: 5, value: "0"},
    //         ],
    //     };
    //     return effect;
    // }
}
