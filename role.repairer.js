var roleUpgrader = require('role.upgrader');
var actionCollect = require('action.collectResources');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 collect');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🔨 repair');
        }

        if(creep.memory.building) {

            //Check to see if we need to refill towers first
            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                }
            });

            if(tower != undefined){
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                //Fix everything else if it's under 75% durability
                var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < (s.hitsMax * 0.75) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
                });

                if (repairTarget != undefined) {
                    if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    //Repair some walls if we have nothing to do
                    repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.hits < 100000 && s.structureType == STRUCTURE_WALL || s.hits < 100000 && s.structureType == STRUCTURE_RAMPART)
                    });

                    if (repairTarget != undefined) {
                        if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else {
                        roleUpgrader.run(creep);
                    }
                }
            }
        }
        else {
            actionCollect.fromReserves(creep);
        }
    }
};

module.exports = roleRepairer;