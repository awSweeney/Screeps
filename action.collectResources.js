var actionCollectResources = {
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
                s.structureType == STRUCTURE_CONTAINER)

        })

        if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(EnergyStructures, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
module.exports = actionCollectResources;
