var depositResources = require('action.depositResouces');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //Get the harvester back in the right room if it happens to path outside
        if(creep.memory.home != creep.room.name){
            creep.moveTo(Game.rooms[creep.memory.home].controller);
        }
        else{
            
        
            if (creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                if(!depositResources.toSpawn(creep)){
                    depositResources.toStorage(creep);
                }
            }
        }
	}
};

module.exports = roleHarvester;