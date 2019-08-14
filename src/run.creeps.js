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
var roleMineralMiner = require('role.mineralMiner');

var runCreeps = {
    run: function () {
        for(var name in Game.creeps) {

            var creep = Game.creeps[name];

            //check to see if it's time to retire the creep.
            if(!CREEP_RECYCLE_EXCLUSION_LIST.includes(creep.memory.role)){
                roleRetired.run(creep);
            }

            switch(creep.memory.role){
                case 'solider':
                    roleSoldier.run(creep);
                    break;
                case 'healer':
                    roleHealer.run(creep);
                    break;
                case 'hauler':
                    roleHauler.run(creep);
                    break;
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairer.run(creep);
                    break;
                case 'mineralMiner':
                    roleMineralMiner.run(creep);
                    break;
                case 'claimer':
                    roleClaimer.run(creep);
                    break;
                case 'pioneer':
                    rolePioneer.run(creep);
                    break;
            }
        }
    }
}

module.exports = runCreeps;