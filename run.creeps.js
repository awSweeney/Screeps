var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');
var roleSoldier = require('role.soldier');
var roleRanged = require('role.rangedSoldier');
var roleHauler = require('role.hauler');

var runCreeps = {
    run: function () {
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


            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
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
    }
}

module.exports = runCreeps;