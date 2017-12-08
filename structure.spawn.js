var roleTypes = require('role.types');


var ManagerSpawn = {

        run: function() { 
            
            //Scan memory for dead creeps and cleanup
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }

            for(var spawns in Game.spawns){

                var currentSpawn = Game.spawns[spawns];

                var harvesters = currentSpawn.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => creep.memory.role == 'harvester'
                })

                if(harvesters.length == 0){
                    roleTypes.harvester(currentSpawn, currentSpawn.room.energyAvailable)
                }
                else{
                    for(var type in roleTypes){
                        roleTypes[type](currentSpawn, currentSpawn.room.energyAvailable);
                    }
                }

                //Show details over spawn
                if(currentSpawn.spawning) {
                    var spawningCreep = Game.creeps[currentSpawn.spawning.name];
                    currentSpawn.room.visual.text(
                        "🚧" + spawningCreep.memory.role,
                        currentSpawn.pos.x + 1,
                        currentSpawn.pos.y,
                        {align: 'left', opacity: 0.8});
                }
            }
        }
}

module.exports = ManagerSpawn;