var depositResources = require('action.depositResouces');
var actionMove = require('action.move');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //Get the harvester back in the right room if it happens to path outside
        if(creep.memory.home != creep.room.name){
            creep.moveTo(Game.rooms[creep.memory.home].controller);
        }
        else{
            
        
            if (creep.carry.energy < creep.carryCapacity) {
                var target = Game.getObjectById(creep.memory.assignedNode);

                if (target != undefined && target.energy > 0) {

                    if (creep.harvest(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                        actionMove.travelTo(creep, target);
                    }
                }
            }
            else {
                if(!depositResources.toLink(creep)){
                    if(!depositResources.toContainer(creep)){
                        if(!depositResources.toStorage(creep)){
                            depositResources.toSpawn(creep);
                        }
                    }
                }


            }
        }
	}
};

module.exports = roleHarvester;