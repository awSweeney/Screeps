var action = require('action.creep');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say(EMOJI_WORKING);
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say(EMOJI_UPGRADE);
	    }

	    if(creep.memory.upgrading) {

            if(creep.upgradeController(Game.rooms[creep.memory.home].controller) == ERR_NOT_IN_RANGE) {
                action.travelTo(creep, Game.rooms[creep.memory.home].controller);
            }
        }
        else {
            if(!action.collectFromLinkInRangeOf(creep, creep.room.controller, 5, true)){
                if(!action.collectFromStorage(creep)){
                    action.collectFromContainer(creep);
                }
            }
        }
	}
};

module.exports = roleUpgrader;