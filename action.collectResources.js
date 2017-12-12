var actionCollectResources = {

    fromLink: function(creep){

        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK)
                    && structure.energy > 0;
            }
        });

        if (target != undefined) {
            if (creep.withdraw(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }
        else{
            return false;
        }
    },

    fromStorage: function(creep) {


        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (
                                s.structureType == STRUCTURE_EXTENSION)
                                && s.energy > 0
    })

        if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(EnergyStructures, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    fromReserves: function(creep){

        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_CONTAINER ||
                s.structureType == STRUCTURE_STORAGE)
                && _.sum(s.store) > 0

        })

        if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(EnergyStructures, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
module.exports = actionCollectResources;
