import { error, log } from "../ThandulsTogglableEffects";
import { rollFromCompendium} from './rollFromCompendium';
import { MODULE_NAME } from './settings';

/**
 *
 * @param array
 * @param perChunk
 * @returns
 */
export const arrayChunk = function(array, perChunk) {
    return array.reduce((resultArray, item, index) => {
        if(resultArray){
            const chunkIndex = Math.floor(index / perChunk);
            if(!resultArray[chunkIndex]) { 
                resultArray[chunkIndex] = [] 
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }else{
            return [];
        }
    }, []);
}

/**
 *
 * @param minutes
 * @param turns
 * @returns
 */
export const getDurationData = function (minutes, turns=0) {
    return game.combat
    ? {
        startRound: game.combat.round,
        rounds: turns > 0 ? 0 : 10 * minutes,
        turns: turns
    }
    : {
        startTime: game.time.worldTime,
        seconds: 60 * minutes
    }
}

/**
 * A escamotage for set a active effect like a temporary
 * @returns
 */
export const getDurationDataForEffect = function(){
    // let duration = {
    //     rounds: 100,
    //     seconds: 600,
    //     startRound: null,
    //     startTime: null,
    //     startTurn: null,
    //     turns: null
    // };
    // return duration;
    return getDurationData(60,0);
}

export const isBarbarianClassItem = function(item) {
	return (item.type === "class" && item.name === "Barbarian");
}

export const isDAEEnabled = function () {
    return game.modules.get("dae") && game.modules.get("dae").active;
}

/**
 * Manage a more dynamic patter
 * @param {*} compendiumPackName
 * @param {*} effectName
 */
export const retrieveEffectFromCompendium = async function(compendiumPackName,effectName){
    //const compendiumPackName = 'pf2e.feature-effects';
    //const effectName = 'Effect: Rage';
    const pack = game.packs.get(compendiumPackName);
    if(pack){
        try{
            await pack.getIndex();
            // .catch(error => {
            //     console.error(error)
            // });
        }catch(e){
            console.error(e);
        }

        //const effectId = pack.index.find(e => e.name === effectName)._id;
        const packItem = pack.index.find(e => e.name === effectName);
        if(packItem){
            const packItemId = packItem._id;
            const packItemImg = packItem.img;
            //let packItemEntry = await pack.getEntry(packItemId);
            let effect = await pack.getEntry(packItemId).then(effect => {
                if(!effect.name){
                    effect.name = effectName;
                }
                if(!effect.label){
                    effect.label = effectName;
                }
                if(!effect.icon){
                    effect.icon = packItemImg;
                }
                return effect;
            });
            //const actor = game.user.character;
            //await pack.getEntry(effectId).then(effect => actor.createOwnedItem(effect) );
            //return packItemEntry.effects[0];
            return effect;
        }else{
            error("Can't find effect '"+effectName+"' on compendium '"+compendiumPackName+"");
            //DEFAULT VALUE
            return  {
                    name: effectName,
                    label: effectName,
                    icon: "",
                    duration: getDurationData(1),
                    changes: [],
                };
        }
    }else{
        error("Can't find compendium with name '"+compendiumPackName+"'");
        //DEFAULT VALUE
        return  {
            name: effectName,
            label: effectName,
            icon: "",
            duration: getDurationData(1),
            changes: [],
        };
    }
}

/**
 * type the name of the effect in "EFFECT NAME"
 * @href https://www.reddit.com/r/FoundryVTT/comments/jwev5i/dynamic_active_effects_macro_to_toggle_effect/
*/
export const toogleDAEEffect = async function(token,effect_name) {
    //const effect_name = "EFFECT NAME";
    const effect = token.actor.effects.entries;
    for (let i = 0; i < effect.length; i++){
        let condition = effect[i].data.label;
        let status = effect[i].data.disabled;
        let effect_id = effect[i].data._id;
        if ((condition === effect_name) && (status === false)) {
            await token.actor.updateEmbeddedEntity("ActiveEffect", {"_id": effect_id, "disabled" : true});
        }
        if ((condition === effect_name) && (status === true)){
            await token.actor.updateEmbeddedEntity("ActiveEffect", {"_id": effect_id, "disabled" : false});
        }
    }
}

export const ACTIVE_EFFECT_MODES = {
    CUSTOM: 0,
    MULTIPLY: 1,
    ADD: 2,
    DOWNGRADE: 3,
    UPGRADE: 4,
    OVERRIDE: 5
};

export const MACRO_CONDITIONAL_VISIBILITY = {
  TOGGLE_HIDE_FIXED_VALUE: "Toggle Hide (Fixed Value)",
  TOGGLE_HIDE_STEALTH_ROLL: "Toggle Hide (Stealth Roll)",
  TOGGLE_INVISIBLE: "Toggle Invisible",
  TOGGLE_IN_DARKNESS: "Toggle In Darkness",
  TOGGLE_OBSCURED: "Toggle Obscured"
  // TOGGLE_ATTEMPTO: "Attempt to Migrate Conditional Visiblity Foundry 0.6 to 0.7"
};

export const importActiveEffectsToCompendium = async function(compendiumPackName,effect){
    // Reference a Compendium pack by it's collection ID
    const pack = game.packs.find(p => p.collection === compendiumPackName);

    // Load an external JSON data file which contains data for import
    // const response = await fetch("worlds/myworld/data/import.json");
    // const content = await response.json();
    const content = effect;
    // Create temporary Actor entities which impose structure on the imported data
    const activeEffect = await Item.create(content, {temporary: true});

    // Save each temporary Actor into the Compendium pack
    await pack.importEntity(activeEffect);
    log(`Imported Actor ${activeEffect.data.name} into Compendium pack ${compendiumPackName}`);
    return effect;
}

/**
 * @href https://github.com/arbron/fvtt-compendium-tools/blob/main/scripts/compatibility/rollFromCompendium.js
 * @href https://github.com/itamarcu/roll-from-compendium/blob/master/scripts/roll-from-compendium.js
 * @param compendiumPackName 
 */
export async function getRandomItemFromCompendium(compendiumPackName) {
    // const module = game.modules.get('roll-from-compendium');
    const compendium = game.packs.find(p => p.collection === compendiumPackName);
    const contents = await compendium.getContent();
    //const key = getRandomKey(contents);
    let key;
    let index = Math.floor(Math.random() * contents.length);
    let cntr = 0;
    for (let keyRand of contents.keys()) {
        if (cntr++ === index) {
            key = keyRand;
        }
    }
    const mouseEvent = event;
    const item = contents[key];
    // compendium.getEntity(entryId).then(item => {
    //     module.rollFromCompendium(item, mouseEvent)
    // });
    // return module.rollFromCompendium(item, mouseEvent);
    // let randomItem = await rollFromCompendium(item, mouseEvent);
    // return randomItem;
    return item;
}

export const getRandomKey = function(collection) {
    let index = Math.floor(Math.random() * collection.size);
    let cntr = 0;
    for (let key of collection.keys()) {
        if (cntr++ === index) {
            return key;
        }
    }
}


