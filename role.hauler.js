var action = require('action.creep');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.carry.energy == 0) {
            creep.memory.depositing = false;
            creep.say(EMOJI_WORKING);
        }
        if(!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say(EMOJI_COMPLETE);
        }

        var storageHub = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_STORAGE
        })


        if(!creep.memory.depositing) {

                //Look for links
                if(!action.collectFromLinkInRangeOf(creep, storageHub, 5, false)){
                    //If there's no links look for containers, but only if there's a place to put it
                    var storageTest = false;

                    if(creep.room.storage != undefined){
                        var storage = _.sum(creep.room.storage.store);
                        storageTest = storage < creep.room.storage.storeCapacity ? true : false;
                    }
                    
                    if(creep.room.energyAvailable < creep.room.energyCapacityAvailable || storageTest || action.findLinksInRangeOf(storageHub, 5, false)){
                        if(!action.collectFromContainer(creep)){
                            //If we can't collect from a container move to collect from storage, if there's a place to put it
                            if(creep.room.energyAvailable < creep.room.energyCapacityAvailable || action.findLinksInRangeOf(storageHub, 5, false)){
                                if(!action.collectFromStorage(creep) && creep.carry > 0){
                                    creep.memory.depositing = true;
                                }
                            }
                            creep.memory.depositing = true;
                        }
                    }
                    creep.memory.depositing = true;
                }

        }
        else{

            if(!action.depositToSpawn(creep)){
                if(!action.depositToExtensions(creep)){
                    if(!action.depositToLinkInRangeOf(creep, storageHub, 5, false)){
                        if(!action.depositToStorage(creep)){
                            action.depositToContainer(creep);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHauler;