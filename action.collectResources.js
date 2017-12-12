var actionCollectResources = {

    fromLink: function(creep){

        if(creep.room.memory.collectLink != undefined){
            var target = Game.getObjectById(creep.room.memory.collectLink);

            if (target != undefined && target.energy > 0) {
                if (creep.withdraw(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }

                return true;
            }
        }

        return false;
    },

    fromExtensions: function(creep) {


        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (
                                s.structureType == STRUCTURE_EXTENSION)
                                && s.energy > 0
    })

        if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(EnergyStructures, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    fromStorage: function(creep){

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
