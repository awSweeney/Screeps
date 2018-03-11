var roleUpgrader = require('role.upgrader');
var action = require('action.creep');

const WALL_HEALTH_TARGET = 175000;
const START_REPAIR_THRESHOLD = 0.75;

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
            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                }
            });

            if(tower != undefined){
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    action.travelTo(creep, tower);
                }
            }
            else {
                //Fix everything else if it's under 75% durability
                var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < (s.hitsMax * START_REPAIR_THRESHOLD) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
                });

                if (repairTarget != undefined) {
                    if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                        action.travelTo(creep, repairTarget);
                    }
                }
                else {
                    //Repair some walls if we have nothing to do
                    repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.hits < WALL_HEALTH_TARGET && s.structureType == STRUCTURE_WALL || s.hits < WALL_HEALTH_TARGET && s.structureType == STRUCTURE_RAMPART)
                    });

                    if (repairTarget != undefined) {
                        if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                            action.travelTo(creep, repairTarget);
                        }
                    }
                    else {
                        roleUpgrader.run(creep);
                    }
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