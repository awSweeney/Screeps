var action = require('action.creep');


var roleMineralMiner = {

    run: function(creep) {

        
        if (_.sum(creep.carry) < creep.carryCapacity) {
            var target = Game.getObjectById(creep.memory.assignedNode);

            if (target != undefined && target.mineralAmount > 0) {

                if (action.collectMineral(creep, target)) {
                    action.travelTo(creep, target);
                }
            }
        }
        else {
            if(!action.depositToTerminal(creep)){
                action.depositToStorage(creep);
            }
        }
        
	}
};

module.exports = roleMineralMiner;