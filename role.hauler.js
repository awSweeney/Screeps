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


        if(!creep.memory.depositing) {

            var links = creep.room.find(FIND_STRUCTURES,{
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            });

            if(links.length > 0){
                if(!actionCollect.fromLink(creep)){
                    actionCollect.fromReserves(creep);
                }
            }
            else{
                actionCollect.fromReserves(creep);
            }
        }
        else{
            actionDeposit.toExtensions(creep);
        }
    }
};

module.exports = roleHauler;