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

            //Spawn creeps, only spawning harvesters if under minimum quantity
            var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            if(harvesterCount.length < roleTypes.harvester.minimumQuantity){
                Game.spawns['Spawn1'].spawnCreep(roleTypes.harvester.properties, roleTypes.harvester.name + Game.time, roleTypes.harvester.memory);
            }
            else {

                for (var type in roleTypes) {
                    var currentCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleTypes[type].name);
                    if (currentCount.length < roleTypes[type].minimumQuantity) {
                        Game.spawns['Spawn1'].spawnCreep(roleTypes[type].properties, roleTypes[type].name + Game.time, roleTypes[type].memory);
                    }
                }
            }

            //Show details over spawn
            if(Game.spawns['Spawn1'].spawning) {
                var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    "🚧" + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    {align: 'left', opacity: 0.8});
            }


        }
}

module.exports = ManagerSpawn;