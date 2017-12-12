var link = {
    run: function(roomName){

        //Check to see if room has links defined, if not try and locate and define links
        if(Game.rooms[roomName].memory.depositLink == undefined || Game.rooms[roomName].memory.collectLink == undefined){

            var links = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            });

            if(links.length > 0){

                for(var link in links){

                    if(Game.flags.collectLink != undefined){
                        console.log(links[link].pos);

                        if(Game.flags.collectLink.pos.isEqualTo(links[link].pos)){
                            Game.rooms[roomName].memory.collectLink = links[link].id;
                            Game.flags.collectLink.remove();
                        }
                    }
                    else{
                        if(Game.flags.depositLink != undefined){
                            if(Game.flags.depositLink.pos.isEqualTo(links[link].pos)){
                                Game.rooms[roomName].memory.depositLink = links[link].id;
                                Game.flags.depositLink.remove();
                            }

                        }
                        else{
                            console.log("Link flag not found for " + roomName + ". Use collectLink or depositLink flags to mark link types");
                        }
                    }
                }
            }
        }
        else{
            var collectLink = Game.getObjectById(Game.rooms[roomName].memory.collectLink);
            var depositLink = Game.getObjectById(Game.rooms[roomName].memory.depositLink);

            if(depositLink.cooldown == 0 && depositLink.energy > 0){
                depositLink.transferEnergy(collectLink, depositLink - collectLink);
            }
        }
    }
};


module.exports = link;