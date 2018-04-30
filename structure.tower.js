var tower = {

    run: function(roomName){
        
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS,{
                filter: (target) => (target.getActiveBodyparts(HEAL) > 0 &&
                                    FRIENDLY_PLAYERS.toLowerCase().indexOf(target.owner.username.toLowerCase()) == -1) ||
                                    target.name.toLowerCase().search('invader_') != -1
        });
        
        
        if(hostiles.length == 0){
            hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {
                filter: (target) => (FRIENDLY_PLAYERS.toLowerCase().indexOf(target.owner.username.toLowerCase()) == -1) ||
                                    target.name.toLowerCase().search('invader_') != -1
            });
        }
        
        
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
};

module.exports = tower;

