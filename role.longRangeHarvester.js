var roleLongRangeHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.depositing && creep.carry.energy == 0) {
            creep.memory.depositing = false;
            creep.say('🔄 collect');
        }
        if(!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('✔ deposit');
        }


            if (!creep.memory.depositing) {
                if (creep.harvest(Game.getObjectById("59f1a07d82100e1594f36c01")) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById("59f1a07d82100e1594f36c01"), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {

                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });

                if(target == undefined) {

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
                        if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                else{
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }


            }

	}
};

module.exports = roleLongRangeHarvester;