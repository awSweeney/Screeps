var roleUpgrader = require('role.upgrader');
var action = require('action.creep');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say(EMOJI_WORKING);
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say(EMOJI_BUILDING);
        }

        if(creep.memory.building) {

            //Check to see if we need to refill towers first
            var tower = Game.rooms[creep.memory.home].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                }
            });

            if(tower.length){
                if (creep.transfer(tower[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    action.travelTo(creep, tower[0]);
                }
            }
            else {
               
               var target;
               
               if(creep.memory.target != undefined){
                   target = Game.getObjectById(creep.memory.target);
               }
               
                //Check to see if target is still valid | If the object exists || if it's at max health || or if it' still in the queue
                if(target != undefined){
                    if(target.hits == target.hitsMax || Game.rooms[creep.memory.home].memory.repairQueue.indexOf(creep.memory.target) == -1){
                        delete creep.memory.target;
                    }
                }
                
                //Get a new target if need be
                if(Game.rooms[creep.memory.home].memory.repairQueue.length && creep.memory.target == undefined){
                    creep.memory.target = Game.rooms[creep.memory.home].memory.repairQueue[0];
                    target = Game.getObjectById(creep.memory.target);
                    
                    //Remove the target from the list if the list hasn't been updated yet
                    if(target == undefined || target.hits == target.hitsMax){
                        Game.rooms[creep.memory.home].memory.repairQueue.shift();
                    }
                }
                
                //Repair the thing
                if(target != undefined){
                    if(creep.repair(target) == ERR_NOT_IN_RANGE){
                        action.travelTo(creep, target);   
                    }
                }
                else{
                    roleUpgrader.run(creep);
                }
            }
        }
        else {
            if(!action.collectFromStorage(creep)){
                action.collectFromContainer(creep);
            }
        }
    }
};

module.exports = roleRepairer;