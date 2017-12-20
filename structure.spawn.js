var generalTypes = require('role.generalTypes');
var expansionTypes = require('role.expansionTypes');
var offenseTypes = require('role.offenseTypes');

const SPAWN_DELAY_TICKS = 90; //Delay in ticks a spawn goes into cooldown after spawning a creep

var ManagerSpawn = {

        run: function() { 
            
            //Scan memory for dead creeps and cleanup
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }

            //Logic to check population for general creep type populations
            for(var spawns in Game.spawns){

                var currentSpawn = Game.spawns[spawns];

                var harvesters = currentSpawn.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => creep.memory.role == 'harvester'
                })

                var energyAvailable = currentSpawn.room.energyAvailable * 0.75;
                energyAvailable = energyAvailable < 300 ? energyAvailable = 300 : energyAvailable;

                //If a room has no harvesters only focus on spawning harvesters, will spawn even if spawn is on cooldown
                if(harvesters.length == 0){
                    generalTypes.harvester(currentSpawn, energyAvailable)
                }
                else{

                    if(currentSpawn.room.memory.lastSpawn == undefined){
                        currentSpawn.room.memory.lastSpawn = Game.time - SPAWN_DELAY_TICKS;
                    }

                    //Only spawn a creep if the cooldown has expired, cooldown allows energy to recover and eases CPU usage
                    if(Game.time - currentSpawn.room.memory.lastSpawn >= SPAWN_DELAY_TICKS) {

                        for (var type in generalTypes) {
                            if (generalTypes[type](currentSpawn, energyAvailable)) {
                                currentSpawn.room.memory.lastSpawn = Game.time;
                            }
                        }
                    }
                    else{
                        //Show details over spawn
                        if(!currentSpawn.spawning) {
                            currentSpawn.room.visual.text(
                                "⏳ " + (SPAWN_DELAY_TICKS - (Game.time - currentSpawn.room.memory.lastSpawn)),
                                currentSpawn.pos.x,
                                currentSpawn.pos.y + 1.5,
                                {align: 'center', opacity: 0.8});
                        }
                        else{

                            var spawningCreep = Game.creeps[currentSpawn.spawning.name];
                            currentSpawn.room.visual.text(
                                "🛠" + spawningCreep.memory.role,
                                currentSpawn.pos.x,
                                currentSpawn.pos.y + 1.5,
                                {align: 'center', opacity: 0.8});
                        }
                    }
                }
            }

            //Logic to check for expansion creep types
            if(Game.flags.claim != undefined){

                var rangeCheck = Infinity;
                var closestSpawn;

                //Only spawn if not on CD
                if(Game.time - currentSpawn.room.memory.lastSpawn >= SPAWN_DELAY_TICKS || currentSpawn.room.memory.lastSpawn == undefined) {

                    //Cycle through expansion types list
                    for (var type in expansionTypes) {



                        var quantity = _.filter(Game.creeps, (creep) => creep.memory.role == expansionTypes[type].name);

                        if (quantity.length < expansionTypes[type].minimumQuantity()) {

                            //Find the closest spawn point to the claim point
                            for (var spawn in Game.spawns) {

                                if (rangeCheck > PathFinder.search(Game.spawns[spawn].pos, Game.flags.claim.pos).cost && !PathFinder.search(Game.spawns[spawn].pos, Game.flags.claim.pos).incomplete) {
                                    rangeCheck = PathFinder.search(Game.spawns[spawn].pos, Game.flags.claim.pos).cost;
                                    closestSpawn = spawn;
                                }
                            }

                            //If a vaild path was found spawn the creep
                            if (rangeCheck != Infinity) {

                                if (expansionTypes[type].spawn(closestSpawn)) {
                                    Game.spawns[closestSpawn].room.memory.lastSpawn = Game.time;
                                }
                            }
                            else {
                                console.log("Valid path for expansion creep not found");
                            }
                        }
                    }
                }

            }


            if(Game.flags.attack != undefined) {
                var rangeCheck = Infinity;
                var closestSpawn;

                for (var type in offenseTypes) {

                        //Find the closest spawn point to the attack point
                        for (var spawn in Game.spawns) {

                            if (rangeCheck > PathFinder.search(Game.spawns[spawn].pos, Game.flags.attack.pos).cost && !PathFinder.search(Game.spawns[spawn].pos, Game.flags.attack.pos).incomplete) {
                                rangeCheck = PathFinder.search(Game.spawns[spawn].pos, Game.flags.attack.pos).cost;
                                closestSpawn = spawn;
                            }
                        }

                        //If a vaild path was found spawn the creep
                        if (rangeCheck != Infinity) {

                            var energyAvailable = currentSpawn.room.energyAvailable * 0.75;
                            energyAvailable = energyAvailable < 300 ? energyAvailable = 300 : energyAvailable;
                            offenseTypes[type](closestSpawn, energyAvailable);
                        }
                        else {
                            console.log("Valid path for attack location not found");
                        }

                }
            }
        }
}

module.exports = ManagerSpawn;