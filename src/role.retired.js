//Retire a creep ensuring any energy it's holding doesn't get lost on death

var action = require('action.creep');

var roleRetired = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.ticksToLive <= 100 && creep.memory.role != 'retired'){
            creep.memory.role = 'retired';
            creep.memory.dropped = false;
        }
        else{
            if(creep.memory.role == 'retired'){

                creep.say(EMOJI_RECYCLE);

                if(_.sum(creep.carry) > 0 && creep.memory.dropped == false){
                    if(!action.depositToStorage(creep)){
                        if(!action.depositToContainer(creep)){
                            creep.memory.dropped = true;
                        }
                    }
                }
                else{
                    creep.suicide();

                    //Recycle gains did not seem worth the time and ended up breaking hauler pathing for minimal gains
                    //If this is reactivated also reactivate recycle portion of run.rooms in roomSetup
                    /*if(creep.room.memory.recyclePoint == null){
                            console.log("No recycle point found in " + creep.room + ". Add a container next to a spawn point");

                    }
                    else{
                        if(Game.getObjectById(creep.room.memory.recycleSpawn).recycleCreep(creep) == ERR_NOT_IN_RANGE){
                            actionMove.travelTo(creep, Game.getObjectById(creep.room.memory.recyclePoint).pos);
                        }
                    }*/
                }
            }
        }

    }
};

module.exports = roleRetired;