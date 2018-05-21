//const EXTENSIONS_PER_HAULER = 20;
const CONSTRUCTION_SITES_PER_BUILDER = 10;
const HARVEST_PER_TICK_GOAL = 20; //Takes 10 energy drain per tick to drain a source node, double that for safety
const HAULER_MAX_CARRY = 800 / CARRY_CAPACITY;

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

            //If the room is missing start the process to spawn more
            if(quantity.length < Game.rooms[roomName].memory.roomRequiredHarvesters) {

                var sources = Game.rooms[roomName].memory.sources;

                //Check each source to figure out which is missing harvesters
                for (var source in sources) {

                    quantity = spawn.room.find(FIND_MY_CREEPS, {
                        filter: (creep) => (
                            creep.memory.role == name && creep.memory.assignedNode == sources[source].nodeID
                        )
                    });

                    if (quantity.length < sources[source].minimumQuantity) {

                        //Check to see if node has a drop off point established, link or container
                        var node = Game.getObjectById(sources[source].nodeID);

                        var targets = spawn.room.find(FIND_STRUCTURES, {
                            filter: (s) => s.structureType == STRUCTURE_LINK ||s.structureType == STRUCTURE_CONTAINER
                        });

                        node = node.pos.findInRange(targets, 3);

                        var allowance;

                        //If the point has a drop off point attempt to make a non traveling harvester
                        if(node.length > 0){
                            allowance = Math.floor(energy / 300);

                            //Try to make a harvester with more work ratio
                            if(allowance >= 1){

                                body.push(CARRY);

                                for(var x = 1; x <= allowance && (HARVEST_POWER * x) <= HARVEST_PER_TICK_GOAL; x++){
                                    body.push(WORK);
                                    body.push(WORK);
                                    body.push(MOVE);

                                    //10 WORK, gives 20 a tick, to avoid losing 10 energy on 3rd hit add more carry
                                    if(x % 5 == 0){
                                        body.push(CARRY);
                                    }
                                }
                            }
                            else{ //Otherwise make a normal version
                                allowance = Math.floor(energy / 200);
                                body.push(CARRY);

                                for (var x = 1; x <= allowance && (HARVEST_POWER * x) <= HARVEST_PER_TICK_GOAL; x++) {
                                    body.push(WORK);
                                    body.push(MOVE);

                                    //10 WORK, gives 20 a tick, to avoid losing 10 energy on 3rd hit add more carry
                                    if(x % 10 == 0){
                                        body.push(CARRY);
                                    }
                                }
                            }

                        }
                        else{
                            //Make a traveling harvester if no drop off point established
                            allowance = Math.floor(energy / 200);

                            for (var x = 1; x <= allowance && (HARVEST_POWER * x) <= HARVEST_PER_TICK_GOAL; x++) {
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

    builder: function(spawn, energy){

        var minimumQuantity = function(){
            var buildingProjects = spawn.room.memory.buildQueue.length;
            if(buildingProjects != undefined){

                var quantity = buildingProjects / CONSTRUCTION_SITES_PER_BUILDER;

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
            var quantity =  _(Game.creeps).filter((creep) => creep.memory.role == 'builder'  && creep.memory.home == spawn.room.name).value();

            if(quantity.length < minimumQuantity()){
                var allowance = Math.floor(energy / 200);

                if(allowance >= 1){
                    for(var x = 0; x < allowance && x <= 7; x++){
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

    hauler: function(spawn, energy){


        var memory = {memory: {role: 'hauler', home: spawn.room.name, gatheredFromStorage: false}};
        var name = 'hauler'
        var body = [];

        var minimumQuantity = function(){

            var extensions = spawn.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_EXTENSION
            });


            if(extensions != undefined){

                return spawn.room.memory.sourceNodes;

                /*var quantity = extensions.length / EXTENSIONS_PER_HAULER;
                return quantity >= 0 ? Math.ceil(quantity) : Math.floor(quantity);*/
            }

            return 0;
        }


        var quantity = spawn.room.find(FIND_MY_CREEPS, {
            filter: (creep) => (
                creep.memory.role == name
            )
        })

        if (quantity.length < minimumQuantity()) {
            
            /*var storageStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_LINK ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_STORAGE
            });*/
            
            //We only want to spawn haulers if there's actually structures for them to haul to/from
            //if (storageStructures.length > 0){
                
                var allowance = Math.floor(energy / 150);

                if (allowance >= 1) {
                    for (var x = 1; x <= allowance && x <= HAULER_MAX_CARRY; x++) {
    
                        body.push(CARRY);
    
                        if(x % 2 == 0){
                            body.push(MOVE);
                        }
                    }
                }
    
                if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                    return true;
                }
            //} storage structure check end
        }

        return false;
    },

    meleeDefender: function(spawn, energy){

        var memory = {memory: {role: 'soldier'}};
        var name = 'soldier'
        var body = [];

        var hostiles = Game.rooms[spawn.room.name].find(FIND_HOSTILE_CREEPS);
        

        if(hostiles.length > 0){

            var hostileStrength = hostiles[0].getActiveBodyparts(ATTACK);
            hostileStrength += hostiles[0].getActiveBodyparts(RANGED_ATTACK);
            hostileStrength += hostiles[0].getActiveBodyparts(HEAL);
            hostileStrength += hostiles[0].getActiveBodyparts(MOVE);
            hostileStrength += hostiles[0].getActiveBodyparts(TOUGH);

            var quantity =  spawn.room.find(FIND_MY_CREEPS,{
                filter: (creep) => (
                    creep.memory.role == name
                )
            })

            if(quantity.length < hostiles.length) {
                var allowance = Math.floor(energy / 200);

                if (allowance >= 1) {
                    for (var x = 0; x < allowance && x < 10 && x < Math.ceil((hostileStrength / 5) + 1); x++) {
                        body.push(TOUGH);
                        body.push(TOUGH);
                        body.push(MOVE);
                        body.push(MOVE);
                        body.push(ATTACK);
                    }

                    if(spawn.spawnCreep(body, name + Game.time, memory) == OK){
                        return true;
                    }
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
                for(var x = 0; x < allowance && x <= 7; x++){
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

        var buildingCheck = spawn.room.memory.repairQueue.length;

        if(buildingCheck > 0){
           
            var quantity =  _(Game.creeps).filter((creep) => creep.memory.role == 'repairer'  && creep.memory.home == spawn.room.name).value();
            
            
            if(quantity.length < minimumQuantity){
                var allowance = Math.floor(energy / 200);
    
                if(allowance >= 1){
                    for(var x = 0; x < allowance && x <= 7; x++){
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

    mineralMiner: function(spawn, energy){
        var name = 'mineralMiner'
        var body = [];
        if(spawn.room.controller.level >= 6 && COLLECT_MINERALS == true){
            for(var mineral in spawn.room.memory.minerals){
                
                if(_(Game.creeps).filter((creep) => creep.memory.role == 'mineralMiner'  && creep.memory.home == spawn.room.name && creep.memory.assignedNode == spawn.room.memory.minerals[mineral]).value() == 0){
                    var node = Game.getObjectById(spawn.room.memory.minerals[mineral]);
                    if(node.mineralAmount > 0){
                            var extractor = node.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => structure.structureType == STRUCTURE_EXTRACTOR
                            });
                    
                            if(extractor.length){
                                    var allowance = Math.floor(energy / 200);
    
                                    if(allowance >= 1){
                                    for(var x = 0; x < allowance && x <= 7; x++){
                                        body.push(WORK);
                                        body.push(CARRY);
                                        body.push(MOVE);
                                    }
                            }
    
                            if(spawn.spawnCreep(body, name + Game.time, {memory: {role: 'mineralMiner', home: spawn.room.name, assignedNode: spawn.room.memory.minerals[mineral]}}) == OK){
                                return true;
                            }
                        } 
                    }
                    
                }
            }  
        }
        
        return false;
    },
};