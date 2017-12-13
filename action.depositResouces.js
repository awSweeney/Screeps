var actionDepositResources = {

    toLink: function(creep){

        if(creep.room.memory.depositLink != undefined){

            var rangeTest = creep.pos.getRangeTo(Game.getObjectById(creep.room.memory.depositLink));

            if(rangeTest <= 3){

                if (creep.transfer(Game.getObjectById(creep.room.memory.depositLink), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.room.memory.depositLink), {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return true;
            }
        }

        return false;
    },

    toExtensions: function (creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION)
                    && structure.energy < structure.energyCapacity;
            }
        });

        if (target != undefined) {

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    },

    toStorage: function (creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    _.sum(structure.store) < structure.storeCapacity;
            }
        });

        if (target != undefined) {

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    },

    toContainer: function (creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(structure.store) < structure.storeCapacity;
            }
        });

        if (target != undefined) {

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    },

    toSpawn: function (creep) {

        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
            }
        });


        if(target != undefined){
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    }
}


module.exports = actionDepositResources;