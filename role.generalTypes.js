const EXTENSIONS_PER_HAULER = 20;
const CONSTRUCTION_SITES_PER_BUILDER = 3;

module.exports = {

    harvester: function(spawn, energy){
        var name = 'harvester'
        var body = [];
        var roomName = spawn.room.name;

        if(Game.rooms[roomName].memory.sources == undefined){
            console.log("Harvester attempted to spawn but room data not setup");
            return false;
        }
        else{

            var quantity =  spawn.room.find(FIND_MY_CREEPS,{
                filter: (creep) => (
                    creep.memory.role == name
                )
            });

            if(quantity.length < Game.rooms[roomName].memory.roomRequiredHarvesters) {

                var sources = Game.rooms[roomName].memory.sources;

                for (var source in sources) {

                    quantity = spawn.room.find(FIND_MY_CREEPS, {
                        filter: (creep) => (
                            creep.memory.role == name && creep.memory.assignedNode == sources[source].nodeID
                        )
                    })

                    if (quantity.length < sources[source].minimumQuantity) {
                        var allowance = Math.floor(energy / 200);

                        if (allowance >= 1) {
                            for (var x = 0; x < allowance; x++) {
                                body.push(WORK);
                                body.push(CARRY);
                                body.push(MOVE);
                            }
                        }

                        if (spawn.spawnCreep(body, name + Game.time, {memory: {role: 'harvester', home: spawn.room.name, assignedNode: sources[source].nodeID}}) == OK) {
                            return true;
                        }

                        return false;
                    }

                }
            }
        }

    },

    hauler: function(spawn, energy){


        var memory = {memory: {role: 'hauler', home: spawn.room.name, gatheredFromStorage: false}};
        var name = 'hauler'
        var body = [];

        var minimumQuantity = function(){

            var extensions = spawn.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_EXTENSION
            });


            if(extensions != undefined){

                var quantity = extensions.length / EXTENSIONS_PER_HAULER;

                return quantity >= 0 ? Math.ceil(quantity) : Math.floor(quantity);
            }

            return 0;
        }

        var quantity = spawn.room.find(FIND_MY_CREEPS, {
            filter: (creep) => (
                creep.memory.role == name
            )
        })

        if (quantity.length < minimumQuantity()) {
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

            if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                return true;
            }
        }

        return false;
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

                    if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    builder: function(spawn, energy){


        var minimumQuantity = function(){
            var buildingProjects = spawn.room.find(FIND_CONSTRUCTION_SITES);



            if(buildingProjects != undefined){

                var quantity = buildingProjects.length / CONSTRUCTION_SITES_PER_BUILDER;

                return quantity >= 0 ? Math.ceil(quantity) : Math.floor(quantity);
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

                if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                    return true;
                }
            }
        }

        return false;
    },

    upgrader: function(spawn, energy){
        var minimumQuantity = spawn.room.memory.sourceNodes;
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

            if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                return true;
            }
        }

        return false;
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

            if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                return true;
            }
        }

        return false;
    },

/*

    rangedSoldier: {
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
*/
};