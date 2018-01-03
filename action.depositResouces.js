var actionMove = require('action.move');

var actionDepositResources = {

    findLinksInRangeOf: function(target, range, waitOnCapacity){

        for(var structure in target){

            for(var link in target[structure].room.memory.depositLinks) {

                var link = Game.getObjectById(target[structure].room.memory.depositLinks[link]);
                var rangeTest = target[structure].pos.getRangeTo(link);

                if(rangeTest <= range){
                    if(link.energy < link.energyCapacity){
                        return true;
                    }
                    else{
                        if(waitOnCapacity){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
                else{
                    return false;
                }
            }
        }
    },

    toLink: function(creep){

        if(creep.room.memory.depositLinks.length > 0){

            for(var link in creep.room.memory.depositLinks){

                var rangeTest = creep.pos.getRangeTo(Game.getObjectById(creep.room.memory.depositLinks[link]));

                if(rangeTest <= 3){

                    if (creep.transfer(Game.getObjectById(creep.room.memory.depositLinks[link]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        actionMove.travelTo(creep, Game.getObjectById(creep.room.memory.depositLinks[link]));
                    }
                    return true;
                }
            }
            return false;
        }

        return false;
    },

    toLinkInRangeOf: function(creep, target, range, waitOnCapacity){

        var linkFound = false;

        if(creep.room.memory.depositLinks.length > 0){



            for(var link in creep.room.memory.depositLinks){

                var currentLink = Game.getObjectById(creep.room.memory.depositLinks[link]);

                    if(target.length != undefined){

                        for(var object in target){

                            if(target[object].pos.getRangeTo(currentLink) <= range){

                                if(currentLink.energy != currentLink.energyCapacity){

                                    if (creep.transfer(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        actionMove.travelTo(creep, currentLink);
                                    }

                                    return true;
                                }
                                else{
                                    linkFound = true;
                                }

                            }
                        }
                    }
                    else{
                        if(target.pos.getRangeTo(currentLink) <= range){

                            if(currentLink.energy != currentLink.energyCapacity){

                                if (creep.transfer(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    actionMove.travelTo(creep, currentLink);
                                }

                                return true;
                            }
                            else{
                                linkFound = true;
                            }

                        }
                    }
            }
        }

        if(waitOnCapacity && linkFound){
            return true;
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
                actionMove.travelTo(creep, target);
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
                actionMove.travelTo(creep, target);
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
                actionMove.travelTo(creep, target);
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
                actionMove.travelTo(creep, target);
            }

            return true;
        }

        return false;
    }
}


module.exports = actionDepositResources;