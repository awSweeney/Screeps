var actionMove = require('action.move');

var actionCollectResources = {

    fromLink: function(creep){

        if(creep.room.memory.collectLinks.length > 0){

            for(var link in creep.room.memory.collectLinks){

                var target = Game.getObjectById(creep.room.memory.collectLinks[link]);

                if (target.energy > 0) {
                    if (creep.withdraw(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                        actionMove.travelTo(creep, target);
                    }

                    return true;
                }
            }

        }

        return false;
    },

    fromLinkInRangeOf: function(creep, target, range, waitOnCapacity){

        if(creep.room.memory.collectLinks.length > 0){

            var linkFound = false;

            for(var link in creep.room.memory.collectLinks){

                var currentLink = Game.getObjectById(creep.room.memory.collectLinks[link]);

                    if(target.length != undefined){

                        for(var object in target){

                            if(target[object].pos.getRangeTo(currentLink.pos) <= range){

                                if(currentLink.energy > 0){

                                    if (creep.withdraw(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
                        if(target.pos.getRangeTo(currentLink.pos) <= range){

                            if(currentLink.energy > 0){

                                if (creep.withdraw(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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

            if(linkFound && waitOnCapacity){
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
        });

        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                actionMove.travelTo(creep, EnergyStructures);
            }

            return true;
        }

        return false;
    },

    fromStorage: function(creep){

        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_STORAGE)
                && _.sum(s.store) > 0

        })
        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                actionMove.travelTo(creep,EnergyStructures);
            }

            return true;
        }

        return false;
    },

    fromContainer: function(creep){

        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_CONTAINER)
                && _.sum(s.store) > 0

        })

        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                actionMove.travelTo(creep, EnergyStructures);
            }

            return true;
        }

        return false;
    }
}
module.exports = actionCollectResources;
