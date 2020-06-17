var link = {
    run: function(roomName){

        for(var dlink in Game.rooms[roomName].memory.depositLinks) {

            var depositLink = Game.getObjectById(Game.rooms[roomName].memory.depositLinks[dlink]);

            //Only try to send if it makes sense to
            if (depositLink.cooldown == 0 && depositLink.energy > 0) {

                var targetEnergy = depositLink.energyCapacity;
                var targetLink;

                //Find the collection link with the most room
                for (var cLink in Game.rooms[roomName].memory.collectLinks) {

                    var collectionLink = Game.getObjectById(Game.rooms[roomName].memory.collectLinks[cLink]);
                    if(collectionLink.energy < targetEnergy){
                        targetLink = collectionLink;
                        targetEnergy = collectionLink.energy;
                    }
                }
                //Send the energy to the collection link with the most room
                depositLink.transferEnergy(targetLink, depositLink.energy - targetLink.energy);
            }
        }
    }
};


module.exports = link;