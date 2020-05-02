var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');
var roleSoldier = require('role.soldier');
var roleHauler = require('role.hauler');
var roleRetired = require('role.retired');
var roleHealer = require('role.healer');
var roleMineralMiner = require('role.mineralMiner');
var populationQueue = require('manager.populationQueue');
var constructionService = require('service.creepConstructor');


global.CREEP_TYPES = {
    'soldier' : { 
        run: function(creep){roleSoldier.run(creep);},
        populate: function(roomName){populationQueue.soldier(roomName);},
        construct: function(energy, opts){return constructionService.solider(energy, opts);},
        priority: 2,
        role: "soldier",
        subType:{
            default: [TOUGH, TOUGH, MOVE, MOVE, ATTACK]
        }
    },
    'healer': {
        run: function(creep){roleHealer.run(creep);},
        populate: function(roomName){populationQueue.healer(roomName);},
        construct: function(energy, opts){return constructionService.healer(energy, opts);},
        priority: 2,
        role: "healer",
        subType:{
            default: [TOUGH, TOUGH, MOVE, MOVE, HEAL]
        }
    }, 
    'hauler': {
        run: function(creep){roleHauler.run(creep);},
        populate: function(roomName){populationQueue.hauler(roomName);},
        construct: function(energy, opts){return constructionService.hauler(energy, opts);},
        priority: 3,
        role: "hauler",
        subType:{
            basic: [CARRY], //Move parts added based on conditions
            default : [CARRY, MOVE]
        }
    }, 
    'harvester': {
        run: function(creep){roleHarvester.run(creep);},
        populate: function(roomName){populationQueue.harvester(roomName);},
        construct: function(energy, opts){return constructionService.harvester(energy, opts);},
        priority: 1,
        role: "harvester",
        subType:{
            worker: [WORK, WORK, MOVE], //Carry parts added based on conditions
            basic: [WORK, MOVE], //Carry parts added based on conditions
            default: [WORK, MOVE, CARRY]
        }
    }, 
    'upgrader': {
        run: function(creep){roleUpgrader.run(creep);},
        populate: function(roomName){populationQueue.upgrader(roomName);},
        construct: function(energy, opts){return constructionService.upgrader(energy, opts);},
        priority: 4,
        role: "upgrader",
        subType:{
            default: [WORK, CARRY, MOVE]
        }
    }, 
    'builder': {
        run: function(creep){roleBuilder.run(creep);},
        populate: function(roomName){populationQueue.builder(roomName);},
        construct: function(energy, opts){return constructionService.builder(energy, opts);},
        priority: 5,
        role: "builder",
        subType: {
            default: [WORK, CARRY, MOVE]
        }
    }, 
    'repairer': {
        run: function(creep){roleRepairer.run(creep);},
        populate: function(roomName){populationQueue.repairer(roomName);},
        construct: function(energy, opts){return constructionService.repairer(energy, opts);},
        priority: 5,
        role: "repairer",
        subType: {
            default: [WORK, CARRY, MOVE]
        }
    },
    'mineralMiner': {
        run: function(creep){roleMineralMiner.run(creep);},
        populate: function(roomName){populationQueue.mineralMiner(roomName);},
        construct: function(energy, opts){return constructionService.mineralMiner(energy, opts);},
        priority: 5,
        role: "mineralMiner",
        subType:{
            default:[WORK, CARRY, MOVE]
        }
    },
    'claimer': {
        run: function(creep){roleClaimer.run(creep);},
        populate: function(roomName){populationQueue.claimer(roomName);},
        construct: function(energy, opts){return constructionService.claimer(energy, opts);},
        priority: 6,
        role: "claimer",
        subType: {
            default: [CLAIM, MOVE, MOVE]
        }
    },
    'pioneer': {
        run: function(creep){rolePioneer.run(creep);},
        populate: function(roomName){populationQueue.pioneer(roomName);},
        construct: function(energy, opts){return constructionService.pioneer(energy, opts);},
        priority: 6,
        role: "pioneer",
        subType: {
            default: [WORK, CARRY, MOVE, MOVE]
        }
    },
    'retired': {
        run: function(creep){if(!CREEP_RECYCLE_EXCLUSION_LIST.includes(creep.memory.role)){roleRetired.run(creep);}},
        populate: function(roomName){/*PassThru We Don't Spawn This Type*/},
        construct: function(energy, opts){/*PassThru We Don't Create This Type*/},
    }
};