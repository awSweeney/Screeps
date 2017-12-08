var actionCollect = require('action.collectResources');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.carry.energy == 0) {
            creep.memory.depositing = false;
            creep.say('🔄 collect');
        }
        if(!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('✔ deposit');
        }

        if(!creep.memory.depositing) {
            //Return energy giving priority on filling towers
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK)
                        && structure.energy > 0;
                }
            });

            if (target != undefined) {
                if (creep.withdraw(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
        else{

            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_CONTAINER)
                        && structure.energy < structure.energyCapacity
                        || _.sum(structure.store) < structure.storeCapacity;
                }
            });

            if (target != undefined) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }




    }
};

module.exports = roleHauler;