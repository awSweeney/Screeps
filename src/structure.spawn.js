const SPAWN_DELAY_TICKS = 90; //Delay in ticks a spawn goes into cooldown after spawning a creep

var ManagerSpawn = {

    run: function() { 
            
        //Scan memory for dead creeps and cleanup
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        for(var spawns in Game.spawns){
                
            var currentSpawn = Game.spawns[spawns];

            if(currentSpawn.room.memory.spawnQueue.length > 0){
                    
                var energyAvailable = currentSpawn.room.energyAvailable * 0.75;
                energyAvailable = energyAvailable < 300 ? energyAvailable = 300 : energyAvailable;

                if(currentSpawn.room.memory.lastSpawn == undefined){
                    currentSpawn.room.memory.lastSpawn = Game.time - SPAWN_DELAY_TICKS;
                }

                //Only spawn a creep if the cooldown has expired, cooldown allows energy to recover and eases CPU usage
                if(Game.time - currentSpawn.room.memory.lastSpawn >= SPAWN_DELAY_TICKS) {
                        var prioritySpawn = currentSpawn.room.memory.spawnQueue[0];
                        var creepDetails = CREEP_TYPES[prioritySpawn.role].construct(energyAvailable, {'spawn':currentSpawn, 'data' : prioritySpawn});
                        if (currentSpawn.spawnCreep(creepDetails.body, creepDetails.name, creepDetails.memory) == 0) {
                            currentSpawn.room.memory.lastSpawn = Game.time;
                            currentSpawn.room.memory.spawnQueue.shift()
                        }
                }
                else{
                    //Show details over spawn
                    if(!currentSpawn.spawning) {
                        currentSpawn.room.visual.text(
                            EMOJI_HOURGLASS + " " + (SPAWN_DELAY_TICKS - (Game.time - currentSpawn.room.memory.lastSpawn)),
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
    }
}

module.exports = ManagerSpawn;