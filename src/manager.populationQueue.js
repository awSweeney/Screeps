var roomCreeps = [];

var populationQueue = {

    harvester : function(roomName){
        var roleName = "harvester";

        if(Game.rooms[roomName].memory.sources == undefined){
            console.log("Room data not setup for " + roomName + ". Cannot spawn harvester");
        }
        else{
            var currentCount = roomCreeps.filter(creep => creep.memory.role == roleName).length;

            if(currentCount < Game.rooms[roomName].memory.roomRequiredHarvesters){
                
                var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName).length;
                addCreepToQueue(roomName, determineSpawnAmount(Game.rooms[roomName].memory.roomRequiredHarvesters, currentCount, queuedCount), {role : roleName, opts : {subType : "default"}});
            }
        }    
    },

    builder : function(roomName){
        var roleName = "builder";

        if(Game.rooms[roomName].memory.buildQueue != undefined){
            var buildingProjects = Game.rooms[roomName].memory.buildQueue.length;

            if(buildingProjects > 0){
    
                var currentCount = roomCreeps.filter(creep => creep.memory.role == roleName).length;
                var ratio = buildingProjects / CONSTRUCTION_SITES_PER_BUILDER;
                var requiredCount = ratio >= 0 ? Math.ceil(ratio) : Math.floor(ratio);
                var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName).length;
    
    
                addCreepToQueue(roomName, determineSpawnAmount(requiredCount, currentCount, queuedCount), {role : roleName, opts : {subType : "default"}});
            } 
        }
    },

    hauler : function(roomName){

        var roleName = "hauler";

        var extensions = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_EXTENSION
        });

        if(extensions != undefined){
            var currentCount = roomCreeps.filter(creep => creep.memory.role == roleName).length;
            var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName).length;
            var requiredCount = Game.rooms[roomName].memory.sourceNodes;

            addCreepToQueue(roomName, determineSpawnAmount(requiredCount, currentCount, queuedCount), {role : roleName, opts : {subType : "default"}});
        }
    },

    upgrader : function(roomName){
        var roleName = "upgrader";
        var requiredCount = Game.rooms[roomName].memory.sourceNodes;
        var currentCount = roomCreeps.filter(creep => creep.memory.role == roleName).length;
        var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName).length;
        addCreepToQueue(roomName, determineSpawnAmount(requiredCount, currentCount, queuedCount), {role : roleName, opts : {subType : "default"}});
    },

    repairer : function(roomName){
        var roleName = "repairer";
        if(Game.rooms[roomName].memory.repairQueue != undefined){
            if(Game.rooms[roomName].memory.repairQueue.length > 0){
                var requiredCount = 1;
                var currentCount = roomCreeps.filter(creep => creep.memory.role == roomName).length;
                var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName).length;
            
                addCreepToQueue(roomName, determineSpawnAmount(requiredCount, currentCount, queuedCount), {role : roleName, opts : {subType : "default"}});
                
            }
        }
    },

    mineralMiner : function(roomName){
        var roleName = "mineralMiner"
        if(Game.rooms[roomName].controller.level >= 6 && COLLECT_MINERALS == true){
            for(var mineral in Game.rooms[roomName].memory.minerals){
                if(_(Game.creeps).filter((creep) => creep.memory.role == roleName  && creep.memory.home == roomName && creep.memory.assignedNode == Game.rooms[roomName].memory.minerals[mineral]).value() == 0){
                    var node = Game.getObjectById(Game.rooms[roomName].memory.minerals[mineral]);
                    if(node.mineralAmount > 0){
                            var extractor = node.room.find(FIND_STRUCTURES, {
                                    filter: (structure) => structure.structureType == STRUCTURE_EXTRACTOR
                            });
                    
                            if(extractor.length){
                                var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType.role == roleName);
                                addCreepToQueue(roomName, determineSpawnAmount(1, 0, queuedCount), {role : roleName, opts : {subType : "default"}});    
                            }
                    }
                }
            }
        }
    },

    soldier : function(roomName){
        
        // var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

        // if(hostiles.length > 0){
        //     var currentCount = roomCreeps.filter(creep => creep.memory.role == "soldier").length;
        //     var queuedCount = Game.rooms[roomName].memory.spawnQueue.filter(creepType => creepType == "solider").length;

        //     if(quantity.length < hostiles.length){
        //         addCreepToQueue(roomName, determineSpawnAmount(hostiles.length,currentCount,queuedCount), "soldier");
        //     }
        // }
    },

    healer : function(roomName){
        //TODO
    },

    claimer : function(roomName){
        //TODO
    },

    pioneer : function(roomName){
        //TODO
    },

    run : function(roomName){
        populationManager(roomName);
        sortQueue(roomName);
    }
}

function sortQueue(roomName){
    var list = Game.rooms[roomName].memory.spawnQueue;
    var sortedList = list.sort(function(a,b){return CREEP_TYPES[a.role].priority - CREEP_TYPES[b.role].priority});
    Game.rooms[roomName].memory.spawnQueue = sortedList;
}

function determineSpawnAmount(requiredAmount, currentAmount, queuedAmount){
    if(requiredAmount > 0 && requiredAmount > (currentAmount + queuedAmount)){
        return requiredAmount - (currentAmount + queuedAmount);
    }
    else{
        return 0;
    }
}

function addCreepToQueue(roomName, quantity, role){

    for(var i = 0; i < quantity; i++){
        Game.rooms[roomName].memory.spawnQueue.push(role);
    }
}

function populationManager (room){
    

    if(Game.rooms[room].memory.spawnQueue == undefined){
        Game.rooms[room].memory.spawnQueue = [];
    }

    roomCreeps =  Game.rooms[room].find(FIND_MY_CREEPS,{
        filter: (creep) => (
            creep.memory.home == room
        )
    });

    for(var creepType in CREEP_TYPES){
        CREEP_TYPES[creepType].populate(room);
    }
}

module.exports = populationQueue;
