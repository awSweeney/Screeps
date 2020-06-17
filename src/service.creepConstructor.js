module.exports = {

    harvester: function(energy, opts){
        
        var roomName = opts.spawn.room.name;
        var sources = Game.rooms[roomName].memory.sources;
        var subType = opts.data.opts.subType;
        var assignedSource;

        for(var source in sources){

            var quantity = opts.spawn.room.find(FIND_MY_CREEPS, {
                filter: (creep) => (
                    creep.memory.role == 'harvester' && creep.memory.assignedNode == sources[source].nodeID
                )
            });
            
            if(quantity.length < sources[source].minimumQuantity){
                var node = Game.getObjectById(sources[source].nodeID);

                var targets = opts.spawn.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_LINK ||s.structureType == STRUCTURE_CONTAINER
                });

                node = node.pos.findInRange(targets, 3);

                if(node.length > 0){
                    subType = 'worker';
                }
                // else{
                //     subType = 'basic'
                // }

                assignedSource = sources[source];
            }
            
            if(assignedSource !== undefined){
                break;
            }
        }

        var baseBody = CREEP_TYPES['harvester'].subType[subType];
        var harvestMultiplier = baseBody.filter((v) => (v === WORK)).length;
        var baseCost = determineCost('harvester', {subType:subType});
        var constructedBody = []
        var buildAllowance = Math.floor(energy / baseCost);
        
        if(subType !== 'default'){
            constructedBody.push(CARRY);
        }

        for(var x = 1; x <= buildAllowance && (HARVEST_POWER * x) <= HARVEST_PER_TICK_GOAL; x++){
            for(var part in baseBody){
                constructedBody.push(baseBody[part]);
            }
            
            if(subType !== 'default'){
                
                //10 WORK, gives 20 a tick, to avoid losing 10 energy on 3rd hit add more carry
                if(x % (10/harvestMultiplier) == 0){
                    constructedBody.push(CARRY);
                }
            }
            
        }
        return {
            body: constructedBody,
            name: 'harvester_' + subType + "_" + Game.time,
            memory: {
                memory:{
                    role: CREEP_TYPES['harvester'].role, 
                    home: roomName, 
                    assignedNode: sources[source].nodeID}}
        }

    },

    builder: function(energy, opts){
        
        var subType =  opts.data.opts.subType;
        var roomName = opts.spawn.room.name;
        var baseBody = CREEP_TYPES['builder'].subType[subType];
        var baseCost = determineCost('builder', {subType:subType});
        var buildAllowance = Math.floor(energy / baseCost);
        var constructedBody = constructBasicBody(buildAllowance, 7, baseBody);

        return{
            body: constructedBody,
            name: 'builder_' + subType + "_" + Game.time,
            memory:{
                memory:{
                    role: CREEP_TYPES['builder'].role,
                    home: roomName
                }
            }
        }

    },

    hauler: function(energy, opts){

        var subType =  opts.data.opts.subType;
        var roomName = opts.spawn.room.name;
        var baseBody = CREEP_TYPES['hauler'].subType[subType];
        var baseCost = determineCost('hauler', {subType:subType});
        var buildAllowance = Math.floor(energy / baseCost);
        var constructedBody = []
        for(var x = 1; x <= buildAllowance && x <= HAULER_MAX_CARRY; x++){
            for(var part in baseBody){
                constructedBody.push(baseBody[part]);
            }

            // if(x % 2 == 0){
            //     constructedBody.push(MOVE);
            // }
        }
        return {
            body: constructedBody,
            name: 'hauler_' + subType + "_" + Game.time,
            memory : {
                memory:{
                    role: CREEP_TYPES['hauler'].role,
                    home: roomName,
                    gatheredFromStorage: false
                }
            }
        }
    },

    upgrader: function(energy, opts){
        var subType =  opts.data.opts.subType;
        var roomName = opts.spawn.room.name;
        var baseBody = CREEP_TYPES['upgrader'].subType[subType];
        var baseCost = determineCost('upgrader', {subType:subType});
        var buildAllowance = Math.floor(energy / baseCost);
        var constructedBody = constructBasicBody(buildAllowance, 7, baseBody);
        
        return{
            body: constructedBody,
            name: 'upgrader_' + subType + "_" + Game.time,
            memory:{
                memory:{
                    role: CREEP_TYPES['upgrader'].role,
                    home: roomName
                }
            }
        }
    },

    repairer: function(energy, opts){
        var subType =  opts.data.opts.subType;
        var roomName = opts.spawn.room.name;
        var baseBody = CREEP_TYPES['repairer'].subType[subType];
        var baseCost = determineCost('repairer', {subType:subType});
        var buildAllowance = Math.floor(energy / baseCost);
        var constructedBody = constructBasicBody(buildAllowance, 7, baseBody);

        return{
            body: constructedBody,
            name: 'repairer_' + subType + "_" + Game.time,
            memory:{
                memory:{
                    role: CREEP_TYPES['repairer'].role,
                    home: roomName
                }
            }
        }
    },

    mineralMiner: function(energy, opts){
        var subType =  opts.data.opts.subType;
        var roomName = opts.spawn.room.name;
        var baseBody = CREEP_TYPES['mineralMiner'].subType[subType];
        var baseCost = determineCost('mineralMiner', {subType:subType});
        var buildAllowance = Math.floor(energy / baseCost);
        var constructedBody = constructBasicBody(buildAllowance, 7, baseBody);

        return{
            body: constructedBody,
            name: 'umineralMiner_' + subType + "_" + Game.time,
            memory:{
                memory:{
                    role: CREEP_TYPES['mineralMiner'].role,
                    home: roomName,
                    assignedNode: opts.spawn.room.memory.minerals[mineral]
                }
            }
        }
    },

    solider: function(energy, opts){
        //TODO
    },

    healer: function(energy, opts){
        //TODO
    },

    claimer: function(energy, opts){
        //TODO
    },

    pioneer: function(energy, opts){
        //TODO
    },
}

function determineCost(creepType, opts){
    var baseCost = 0;
    var baseBody;

    if(opts !== null){
        baseBody = CREEP_TYPES[creepType].subType[opts.subType];
    }
    else{
        baseBody = CREEP_TYPES[creepType];
    }

    var baseCost = 0;

    for(var part in baseBody){
        baseCost += BODYPART_COST[baseBody[part]]
    }

    return baseCost;
}

function constructBasicBody(allowance, threshold, baseBody){
    
    var constructedBody = []
    
    for(var x = 1; x <= allowance && x <= threshold; x++){
        for(var part in baseBody){
            constructedBody.push(baseBody[part]);
        }
    }

    return constructedBody;
}