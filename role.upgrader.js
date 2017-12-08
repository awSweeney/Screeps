var actionCollect = require('action.collectResources');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 collect');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {


            if(creep.upgradeController(Game.rooms[creep.memory.home].controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.rooms[creep.memory.home].controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            actionCollect.fromReserves(creep);
        }
	}
};

module.exports = roleUpgrader;