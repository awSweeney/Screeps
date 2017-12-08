var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleLongRangeHarvester = require('role.longRangeHarvester');
var spawnManager = require('manager.spawn');
var roleSoldier = require('role.soldier');
var roleRanged = require('role.rangedSoldier');
var roleTypes = require('role.types');
var tower = require('structure.tower');
var roleHauler = require('role.hauler');
var link = require('structure.link');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');

var invasion = false;

module.exports.loop = function () {

    for(var roomName in Game.rooms){

        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

        if(hostiles.length > 0){
            invasion = true;
            tower.run(roomName);
        }
        else{
            invasion = false;
        }
    }

    link.run();
    spawnManager.run();

    for(var name in Game.creeps) {

        var creep = Game.creeps[name];


        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
        if(creep.memory.role == 'rangedSoldier') {
            roleRanged.run(creep);
        }

        if(creep.memory.role == 'hauler'){
            roleHauler.run(creep);
        }

        if(creep.memory.role == 'claimer'){
            roleClaimer.run(creep);
        }

        if(creep.memory.role == 'pioneer'){
            rolePioneer.run(creep);
        }
        //Run creep routines, switch everything to harvesters if harvester count is in danger
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length > roleTypes.harvester.minimumQuantity / 2) {

            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }

            if (creep.memory.role == 'longRangeHarvester') {
                roleLongRangeHarvester.run(creep);
            }

            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }

            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }

            if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
        }
        else{
            creep.say("⚠");
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            else {
                roleLongRangeHarvester.run(creep);
            }
        }



            
            

    }
}

