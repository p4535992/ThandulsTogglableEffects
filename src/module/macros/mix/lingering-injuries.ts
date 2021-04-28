
import { debug } from "../../../ThandulsTogglableEffects";
import { getCanvas } from "../../settings";

export async function onChange_Actor(actor, updateData)
{
  let data = {
    id : actor._id,
    actorData : actor.data,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : 0),
    hpChange : (actor.data.data.attributes.hp.value - (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : actor.data.data.attributes.hp.value)),
    actorDS : actor.data.data.attributes?.death?.failure,
    updateDS : (hasProperty(updateData,"data.attributes.death.failure") ? updateData.data.attributes.death.failure : 0),
    dsChange : (actor.data.data.attributes.death.failure - (hasProperty(updateData,"data.attributes.death.failure") ? updateData.data.attributes.death.failure : actor.data.data.attributes.death.failure))
  };

  setTimeout( async ()=>{
    if(dropToZero(data) || await takeCritical(data) || await deathSave(data))
    {
      debug(`on Change | Lingering Injury Detected on ${actor.name}!`);
  
      game.socket['emit']('module.advanced-combat-options', { name : "LI", data : data});
      recieveData(data);
    }else{
      debug(`on Change | Lingering Injury NOT Detected on ${actor.name}!`);
    }
  }, 500);
}

export async function onChange_Token(token,updateData)
{
  let data = {
    id : token._id,
    actorData : getCanvas().tokens.get(token._id).actor.data,
    updateData : updateData,
    actorHP : token.actorData.data.attributes.hp.value,
    updateHP : updateData.actorData.data.attributes.hp.value,
    hpChange : (token.actorData.data.attributes.hp.value - updateData.actorData.data.attributes.hp.value)
  };

  setTimeout( async ()=>{
    if(await takeCritical(data))
    {
      debug(`on Change | Lingering Injury Detected on ${token.name}!`);

      recieveData(data);
    }
  }, 500);
}

export function recieveData(data)
{
  debug("Recieved Data", data);

  let actor = getCanvas().tokens.get(data.id)?.actor ? getCanvas().tokens.get(data.id).actor : game.actors.get(data.id);

  debug("Actor Data : ", actor);

  if(actor.data.permission[game.userId] === CONST.ENTITY_PERMISSIONS.OWNER && !game.user.isGM)
  {
    debug("Entered inside the logic statement --- con save should result");
    executeInjury(actor);

  }else if(game.user.isGM && !hasPlayerOwner(data.actorData))
  {
    debug("This isn't owned by any player --- default to GM");
    executeInjury(actor);
  }
}

async function executeInjury(actor:any = {})
{
  setTimeout(async ()=> {

    let table_pack = await game.packs.find(p=>p.metadata.label === "ThandulsTogglableEffects Tables").getContent();
    let item_pack = await game.packs.find(p=>p.metadata.label === "ThandulsTogglableEffects Items").getContent();

    debug(table_pack,item_pack);

    let table:any = await table_pack.find(t=>t.name === "Lingering Injuries");

    let table_result = await table.draw(); //add setting maybe to allow for private drawing.

    debug(table_result);

    let item = item_pack.find(i=>i.name === table_result.results[0].text);

    if(!item) return debug(`Error with fetching item ${table_result.results.text}`);

    await actor.createOwnedItem(item, {});
  }, 1000);
}

function dropToZero(data:any = {})
{
  if(data.hpChange !== 0 && data.updateData.data?.attributes?.hp?.value === 0)
  {
    debug("Drop to Zero Function | Return True");
    return true;
  }
  debug("Drop to Zero Function | Return False"); 
  return false;
}

async function takeCritical(data:any = {})
{
  for(let message of game.messages)
  {
    let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-takeCritical') ? true : false;
    if(message.isRoll && !flag && message.data.flavor.includes("Attack Roll") && message._roll.parts[0].faces === 20 && critical(message._roll) && data.hpChange > 0)
    {
        debug("Take Critical Function | Return True");
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
    }
    if(!message.isRoll || !message.data.flavor.includes("Attack Roll"))
    {
      await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
    }
  }
  debug("Take Critical Function | Return False");
  return false;

  function critical(rollData)
  {
    let critical = rollData.parts[0].options.critical;
    for(let roll of rollData.parts[0].rolls)
    {
      if(critical <= roll.roll)
      {
        return true;
      }
    }
    return false;    
  }
}

async function deathSave(data:any = {})
{
  if(data.dsChange < 0 && data.updateDS !== 3) 
  {
    for(let message of game.messages)
    {
      let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-deathSave') ? true : false;
      if(message.isRoll && !flag && message.data.flavor.includes("Death Saving Throw") && message._roll._total <= 5)
      {
        debug("Death Save Function | Return True");
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
      }
      await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
    }    
  }
  debug("Death Save Function | Return False");
  return false;
}

function hasPlayerOwner(actorData)
{
  if ( actorData.permission["default"] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  for ( let u of game.users.entities ) {
    if ( u.isGM ) continue;
    if ( actorData.permission[u.id] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  }
  return false;
}