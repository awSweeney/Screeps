var roleRepairer = require('role.repairer');
var action = require('action.creep');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say(EMOJI_WORKING);
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say(EMOJI_BUILDING);
	    }

	    if(creep.memory.building) {
	        
	        //Check to see if target is still valid
	        if(!Game.getObjectById(creep.memory.target)){
	            delete creep.memory.target;
	        }
	        
	        //Get a new target if need be
	        if(creep.room.memory.buildQueue.length && creep.memory.target == undefined){
	            creep.memory.target = creep.room.memory.buildQueue[0];
	            //Remove the target from the list if it hasn't updated yet.
	            if(!Game.getObjectById(creep.memory.target)){
	                creep.room.memory.buildQueue.shift();
	            }
	        }

            //Do the building
            if(creep.memory.target != undefined) {
                if(creep.build(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                    action.travelTo(creep, Game.getObjectById(creep.memory.target));
                }
            }
            else{ //Repair stuff if we have nothing else to do
                roleRepairer.run(creep);
            }
	    }
	    else {
	        if(!action.collectFromStorage(creep)){
	        	if(!action.collectFromContainer(creep)){
	        	    
	        	    //Check to see if it's a new room
	        	    var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                            filter: (s) => (
                                            s.structureType == STRUCTURE_CONTAINER ||
                                            s.structureType == STRUCTURE_STORAGE)
                     })


                     if(EnergyStructures == null){

                        var sources = creep.pos.findClosestByPath(FIND_SOURCES);
	        	    
	        	        if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                                action.travelTo(creep, sources);
                        }
                    }
                     
	        	    
	        	    
	        	}
			}
	    }
	}
};

module.exports = roleBuilder;