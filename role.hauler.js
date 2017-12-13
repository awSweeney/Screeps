var actionCollect = require('action.collectResources');
var actionDeposit = require('action.depositResouces');

//Cooldown time of a link
var STORAGE_CHECK_CD = 30;

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.gatheredFromStorage == null){
            creep.memory.gatheredFromStorage = false;
        }

        if(creep.carry.energy == 0) {
            creep.memory.depositing = false;
            creep.memory.gatheredFromStorage = false;
            creep.memory.gatheredFromStorageTime = 0;
            creep.say('🔄');
        }
        if(!creep.memory.depositing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('✔');
        }


        if(!creep.memory.depositing) {

            var links = creep.room.find(FIND_STRUCTURES,{
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            });

            if(links.length > 0){
                if(!actionCollect.fromLink(creep)){
                    if(!actionCollect.fromContainer(creep)){
                        actionCollect.fromStorage(creep);
                    }
                    creep.memory.gatheredFromStorage = true;
                    creep.memory.gatheredFromStorageTime = Game.time;
                }
            }
            else{
                if(!actionCollect.fromContainer(creep)){
                    actionCollect.fromStorage(creep);
                }
                creep.memory.gatheredFromStorage = true;
                creep.memory.gatheredFromStorageTime = Game.time;
            }
        }
        else{
            //If we've been able to deposit for awhile due to collecting from storage, throw it back in storage and try to collect elsewhere
            if(creep.memory.gatheredFromStorageTime > 0 && creep.memory.gatheredFromStorage){
                if(Game.time - creep.memory.gatheredFromStorageTime >= STORAGE_CHECK_CD){
                    creep.memory.gatheredFromStorage = false;
                    creep.memory.gatheredFromStorageTime = 0;
                }
            }

            if(!actionDeposit.toSpawn(creep)){
                if(!actionDeposit.toExtensions(creep) && !creep.memory.gatheredFromStorage){
                    if(!actionDeposit.toStorage(creep)){
                        actionDeposit.toContainer(creep);
                    }
                };
            }
        }
    }
};

module.exports = roleHauler;