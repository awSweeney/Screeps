var roleRetired = require('role.retired');
require('config.creep');

var runCreeps = {
    
    run: function () {
        
        for(var name in Game.creeps) {

            var creep = Game.creeps[name];

            //check to see if it's time to retire the creep.
            CREEP_TYPES['retired'].run(creep); 
            CREEP_TYPES[creep.memory.role].run(creep);
        }
    }
}

module.exports = runCreeps;