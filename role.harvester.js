var action = require('action.creep');
var roleBuilder = require('role.builder');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //Get the harvester back in the right room if it happens to path outside
        if(creep.memory.home != creep.room.name){
            action.travelTo(creep, Game.rooms[creep.memory.home].controller);
        }
        else{
            
        
            if (creep.carry.energy < creep.carryCapacity) {
                var target = Game.getObjectById(creep.memory.assignedNode);

                if (target != undefined && target.energy > 0) {

                    if (creep.harvest(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                        action.travelTo(creep, target);
                    }
                }
            }
            else {
                if(!action.depositToLink(creep)){
                    if(!action.depositToContainer(creep)){
                        if(!action.depositToStorage(creep)){
                            if(!action.depositToSpawn(creep)){
                                //If we can't deposit anywhere and room is still being setup, turn into a builder to jumpstart room
                                if(creep.room.controller.level == 1){
                                    roleBuilder.run(creep);
                                }
                            }
                        }
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;