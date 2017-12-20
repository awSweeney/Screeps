var actionCollect = require('action.collectResources');
var actionMove = require('action.move');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡');
	    }

	    if(creep.memory.upgrading) {

            if(creep.upgradeController(Game.rooms[creep.memory.home].controller) == ERR_NOT_IN_RANGE) {
                actionMove.travelTo(creep, Game.rooms[creep.memory.home].controller);
            }
        }
        else {
            if(!actionCollect.fromLinkInRangeOf(creep, creep.room.controller, 5, true)){
                if(!actionCollect.fromStorage(creep)){
                    actionCollect.fromContainer(creep);
                }
            }
        }
	}
};

module.exports = roleUpgrader;