
module.exports = {

    harvester: {
        minimumQuantity: 3,
        properties: [WORK, WORK, WORK, CARRY, MOVE],
        memory: {memory: {role: 'harvester', home: Game.spawns['Spawn1'].room.name}},
        name: 'harvester'
    },

    longRangeHarvester: {
        minimumQuantity: 3,
        properties: [WORK, WORK, WORK, CARRY, MOVE, MOVE],
        memory: {memory: {role: 'longRangeHarvester', home: Game.spawns['Spawn1'].room.name}},
        name: 'longRangeHarvester'
    },

    hauler: {
        minimumQuantity: 2,
        properties: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
        memory: {memory: {role: 'hauler', home: Game.spawns['Spawn1'].room.name}},
        name: 'hauler'
    },

    soldier: {
        minimumQuantity: 2,
        properties: [ATTACK, MOVE, MOVE, TOUGH],
        memory: {memory: {role: 'soldier'}},
        name: 'soldier'
    },

    builder: {
        minimumQuantity: 2,
        properties: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        memory: {memory: {role: 'builder', home: Game.spawns['Spawn1'].room.name}},
        name: 'builder'
    },

    rangedSoldier: {
        minimumQuantity: 2,
        properties: [RANGED_ATTACK, MOVE, MOVE],
        memory:{memory: {role: 'rangedSoldier'}},
        name: 'rangedSoldier'
    },

    upgrader: {
        minimumQuantity: 5,
        properties: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        memory: {memory: {role: 'upgrader', home: Game.spawns['Spawn1'].room.name}},
        name: 'upgrader'
    },

    repairer: {
        minimumQuantity: 2,
        properties: [WORK, CARRY, MOVE, MOVE],
        memory: {memory: {role: 'repairer', home: Game.spawns['Spawn1'].room.name, building: false}},
        name: 'repairer'
    },

    disruptor: {
        minimumQuantity: 0,
        properties: [MOVE, MOVE],
        memory: {memory: {role: 'disruptor', home: Game.spawns['Spawn1'].room.name}},
        name: 'disruptor'
    },

    healer: {
        minimumQuantity: 0,
        properties: [HEAL, MOVE, MOVE],
        memory: {memory: {role: 'healer', home: Game.spawns['Spawn1'].room.name}},
        name: 'healer'
    },

    claimer:{
        minimumQuantity: 0,
        properties: [CLAIM, MOVE, MOVE],
        memory: {memory: {role: 'claimer'}},
        name: 'claimer'
    },

    pioneer:{
        minimumQuantity: 4,
        properties: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        memory: {memory: {role: 'pioneer'}},
        name: 'pioneer'
    }

};