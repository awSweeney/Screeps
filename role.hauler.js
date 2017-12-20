var actionCollect = require('action.collectResources');
var actionDeposit = require('action.depositResouces');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.carry.energy == 0) {
            creep.memory.depositing = false;
            creep.say('🔄');
        }
        if(!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('✔');
        }

        var storageHub = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_STORAGE
        })


        if(!creep.memory.depositing) {

                //Look for links
                if(!actionCollect.fromLinkInRangeOf(creep, storageHub, 5, false)){
                    //If there's no links look for containers, but only if there's a place to put it
                    if(creep.room.energyAvailable < creep.room.energyCapacityAvailable || _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity || actionDeposit.findLinksInRangeOf(storageHub, 5, false)){
                        if(!actionCollect.fromContainer(creep)){
                            //If we can't collect from a container move to collect from storage, if there's a place to put it
                            if(creep.room.energyAvailable < creep.room.energyCapacityAvailable || actionDeposit.findLinksInRangeOf(storageHub, 5, false)){
                                if(!actionCollect.fromStorage(creep) && creep.carry > 0){
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

            if(!actionDeposit.toSpawn(creep)){
                if(!actionDeposit.toExtensions(creep)){
                    if(!actionDeposit.toLinkInRangeOf(creep, storageHub, 5, false)){
                        if(!actionDeposit.toStorage(creep)){
                            actionDeposit.toContainer(creep);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHauler;