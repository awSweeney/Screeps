
module.exports = {

    harvester: function(spawn, energy){
        var minimumQuantity = 2;
        var memory = {memory: {role: 'harvester', home: spawn.room.name}};
        var name = 'harvester'
        var body = [];

        var quantity =  spawn.room.find(FIND_MY_CREEPS,{
            filter: (creep) => (
                creep.memory.role == name
            )
        })


        if(quantity.length < minimumQuantity){
            var allowance = Math.floor(energy / 200);

            if(allowance >= 1){
                for(var x = 0; x < allowance; x++){
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
            }

            spawn.spawnCreep(body, name + Game.time, memory);
        }
    },

    longRangeHarvester: function(spawn, energy){
        var minimumQuantity = 2;
        var memory = {memory: {role: 'longRangeHarvester', home: spawn.room.name}};
        var name = 'longRangeHarvester'
        var body = [];

        if(spawn.name != 'Spawn2'){
            var quantity =  spawn.room.find(FIND_MY_CREEPS,{
                filter: (creep) => (
                    creep.memory.role == name
                )
            })


            if(quantity.length < minimumQuantity){
                var allowance = Math.floor(energy / 300);

                if(allowance >= 1){
                    for(var x = 0; x < allowance; x++){
                        body.push(WORK);
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                }

                spawn.spawnCreep(body, name + Game.time, memory);
            }
        }
    },

    hauler: function(spawn, energy){
        var minimumQuantity = 1;
        var memory = {memory: {role: 'hauler', home: spawn.room.name}};
        var name = 'hauler'
        var body = [];

        if(spawn.name != 'Spawn2') {

            var quantity = spawn.room.find(FIND_MY_CREEPS, {
                filter: (creep) => (
                    creep.memory.role == name
                )
            })


            if (quantity.length < minimumQuantity) {
                var allowance = Math.floor(energy / 300);

                if (allowance >= 1) {
                    for (var x = 0; x < allowance; x++) {
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(CARRY);
                        body.push(MOVE);
                        body.push(MOVE);
                    }
                }

                spawn.spawnCreep(body, name + Game.time, memory);
            }
        }

    },

    soldier: function(spawn, energy){

        var minimumQuantity = 1;
        var memory = {memory: {role: 'soldier'}};
        var name = 'soldier'
        var body = [];

        var hostiles = Game.rooms[spawn.room.name].find(FIND_HOSTILE_CREEPS);


        if(hostiles.length > 0){

            var quantity =  spawn.room.find(FIND_MY_CREEPS,{
                filter: (creep) => (
                    creep.memory.role == name
                )
            })

            if(quantity < minimumQuantity) {
                var allowance = Math.floor(energy / 190);

                if (allowance >= 1) {
                    for (var x = 0; x < allowance; x++) {
                        body.push(ATTACK);
                        body.push(TOUGH);
                        body.push(MOVE);
                        body.push(MOVE);
                    }

                    spawn.spawnCreep(body, name + Game.time, memory);
                }
            }
        }
    },

    builder: function(spawn, energy){

        var minimumQuantity = function(){
            var buildingProjects = spawn.room.find(FIND_CONSTRUCTION_SITES);

            if(buildingProjects.length > 0){
                return Math.floor(buildingProjects.length / 3);
            }
            else{
                return 0;
            }
        };

        var memory = {memory: {role: 'builder', home: spawn.room.name}};
        var name = 'builder'
        var body = [];

        if(minimumQuantity() > 0){
            var quantity =  spawn.room.find(FIND_MY_CREEPS,{
                filter: (creep) => (
                    creep.memory.role == name
                )
            })


            if(quantity.length < minimumQuantity()){
                var allowance = Math.floor(energy / 200);

                if(allowance >= 1){
                    for(var x = 0; x < allowance; x++){
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                }

                spawn.spawnCreep(body, name + Game.time, memory);
            }
        }
    },

    upgrader: function(spawn, energy){
        var minimumQuantity = 1;
        var memory = {memory: {role: 'upgrader', home: spawn.room.name}};
        var name = 'upgrader'
        var body = [];

        var quantity =  spawn.room.find(FIND_MY_CREEPS,{
            filter: (creep) => (
                creep.memory.role == name
            )
        })


        if(quantity.length < minimumQuantity){
            var allowance = Math.floor(energy / 200);

            if(allowance >= 1){
                for(var x = 0; x < allowance; x++){
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
            }

            spawn.spawnCreep(body, name + Game.time, memory);
        }
    },

    repairer: function(spawn, energy){
        var minimumQuantity = 1;
        var memory = {memory: {role: 'repairer', home: spawn.room.name}};
        var name = 'repairer'
        var body = [];

        var quantity =  spawn.room.find(FIND_MY_CREEPS,{
            filter: (creep) => (
                creep.memory.role == name
            )
        })


        if(quantity.length < minimumQuantity){
            var allowance = Math.floor(energy / 200);

            if(allowance >= 1){
                for(var x = 0; x < allowance; x++){
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
            }

            spawn.spawnCreep(body, name + Game.time, memory);
        }
    },

    /*rangedSoldier: {
        minimumQuantity: 2,
        properties: [RANGED_ATTACK, MOVE, MOVE],
        memory: function(spawn) {
            return {memory: {role: 'rangedSoldier'}}
        },
        name: 'rangedSoldier'
    },*/

   /* disruptor: {
        minimumQuantity: 0,
        properties: [MOVE, MOVE],
        memory: function(spawn) {
            return {memory: {role: 'disruptor', home: spawn.room.name}}
        },
        name: 'disruptor'
    },

    healer: {
        minimumQuantity: 0,
        properties: [HEAL, MOVE, MOVE],
        memory: function(spawn) {
            return {memory: {role: 'healer', home: spawn.room.name}}
        },
        name: 'healer'
    },

    claimer:{
        minimumQuantity: 0,
        properties: [CLAIM, MOVE, MOVE],
        memory: function(spawn) {
            return {memory: {role: 'claimer'}}
        },
        name: 'claimer'
    },

    pioneer:{
        minimumQuantity: 0,
        properties: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        memory: function(spawn) {
            {memory: {role: 'pioneer'}}
        },
        name: 'pioneer'
    }*/

};