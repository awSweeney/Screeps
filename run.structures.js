var spawnManager = require('structure.spawn');
var tower = require('structure.tower');
var link = require('structure.link');

var runStructures = {
    run: function(){
        var invasion = false;

        for (var roomName in Game.rooms) {

            var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

            if (hostiles.length > 0) {
                invasion = true;
                tower.run(roomName);
            }
            else {
                invasion = false;
            }
        }

        link.run();
        spawnManager.run();
    }
}


module.exports = runStructures;