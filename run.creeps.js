var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');
var roleSoldier = require('role.soldier');
var roleRanged = require('role.rangedSoldier');
var roleHauler = require('role.hauler');
var roleRetired = require('role.retired');
var roleRangedDefender = require('role.rangedDefender');
var roleHealer = require('role.healer');

var runCreeps = {
    run: function () {
        for(var name in Game.creeps) {

            var creep = Game.creeps[name];

            //check to see if it's time to retire the creep.
            if(creep.memory.role != 'soldier' || creep.memory.role != 'healer'){
                roleRetired.run(creep);
            }

            if(Game.flags.attack != undefined){

                if(creep.memory.role == 'soldier'){
                    roleSoldier.run(creep);
                }

                if(creep.memory.role == "healer"){
                    roleHealer.run(creep);
                }
            }

            if(Game.flags.claim != undefined){

                if(creep.memory.role == 'claimer'){
                    roleClaimer.run(creep);
                }

                if(creep.memory.role == 'pioneer'){
                    rolePioneer.run(creep);
                }
            }

            if(creep.memory.role == 'rangedDefender') {
                roleRangedDefender.run(creep);
            }

            if(creep.memory.role == 'hauler'){
                roleHauler.run(creep);
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