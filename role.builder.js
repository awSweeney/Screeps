var roleRepairer = require('role.repairer');
var actionCollect = require('action.collectResources');
var actionMove = require('action.move');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🔨');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    actionMove.travelTo(creep, targets[0]);
                }
            }
            else{
                roleRepairer.run(creep);
            }
	    }
	    else {
	        if(!actionCollect.fromStorage(creep)){
	        	if(!actionCollect.fromContainer(creep)){
	        	    
	        	    //Check to see if it's a new room
	        	    var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                            filter: (s) => (
                                            s.structureType == STRUCTURE_CONTAINER ||
                                            s.structureType == STRUCTURE_STORAGE)
                     })


                     if(EnergyStructures == null){

                        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
	        	    
	        	        if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                     
	        	    
	        	    
	        	}
			}
	    }
	}
};

module.exports = roleBuilder;