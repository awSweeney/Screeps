var tower = {

    run: function(roomName){
        
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS,{
            filter: function(object){
                return object.getActiveBodyparts(HEAL) > 0;
            }
        });
        
        if(hostiles.length == 0){
            hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        }
        
        
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
};

module.exports = tower;

