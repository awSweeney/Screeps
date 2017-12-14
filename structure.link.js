var link = {
    run: function(roomName){

        //Check to see if room has links defined, if not try and locate and define links
        if(Game.rooms[roomName].memory.collectLinks == undefined) {

            var links = [];
            Game.rooms[roomName].memory.collectLinks = links;
        }
        if(Game.rooms[roomName].memory.depositLinks == undefined) {

            var links = [];
            Game.rooms[roomName].memory.depositLinks = links;
        }

            var links = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            });

            if(links.length > 0) {

                if (links.length != Game.rooms[roomName].memory.depositLinks.length + Game.rooms[roomName].memory.collectLinks.length) {

                    for (var link in links) {

                        if (Game.flags.collectLink != undefined) {

                            if (Game.flags.collectLink.pos.isEqualTo(links[link].pos)) {

                                if (Game.rooms[roomName].memory.collectLinks.includes(links[link].id) != undefined) {
                                    Game.rooms[roomName].memory.collectLinks.push(links[link].id);
                                    Game.flags.collectLink.remove();
                                }
                                else {
                                    console.log("Marked collection link already logged");
                                }
                            }
                        }

                        if (Game.flags.depositLink != undefined) {

                            if (Game.flags.depositLink.pos.isEqualTo(links[link].pos)) {

                                if (Game.rooms[roomName].memory.depositLinks.includes(links[link].id) != undefined) {
                                    Game.rooms[roomName].memory.depositLinks.push(links[link].id);
                                    Game.flags.depositLink.remove();
                                }
                            }
                            else {
                                console.log("Marked deposit link already logged");
                            }

                        }
                    }
                }
            }

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
                depositLink.transferEnergy(targetLink, depositLink - targetLink);
            }
        }

    }
};


module.exports = link;