const PIONEER_MIN_QTY = 4;
const CLAIMER_MIN_QTY = 1;

module.exports = {

    claimer: {
        name: 'claimer',
        body: [CLAIM, MOVE, MOVE],
        memory: {memory: {role: 'claimer'}},

        minimumQuantity: function(){
            return CLAIMER_MIN_QTY;
        },

        spawn: function(spawn){
                if(Game.spawns[spawn].spawnCreep(this.body, this.name + Game.time, this.memory) == OK){
                    return true;
                }
                else{
                    return false;
                }
        }
    },

    pioneer: {

        name: 'pioneer',
        body: [WORK, CARRY, MOVE, MOVE],
        memory: {memory: {role: 'pioneer'}},

        minimumQuantity: function(){

            if(_.filter(Game.creeps, (creep) => creep.memory.role == 'claimer') == 0){
                return 0;
            }
            else{

                var roomName = Game.flags.claim.pos.roomName;
                var spawnCheck = 0;

                //Pioneers no longer needed if spawn building has completed
                if(Game.rooms[roomName] != undefined) {

                    spawnCheck = Game.rooms[roomName].find(FIND_MY_SPAWNS, {
                        filter: (structure) => structure.hits == structure.hitsMax
                    });
                }

                if(spawnCheck.length == 1){
                    return 0;
                }
                else{
                    return PIONEER_MIN_QTY;
                }
            }
        },

        spawn: function(spawn){
            if(Game.spawns[spawn].spawnCreep(this.body, this.name + Game.time, this.memory) == OK){
                return true;
            }
            else{
                return false;
            }
        }
    }

};