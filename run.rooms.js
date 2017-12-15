function sourceMonitor(room){

    //If we're draining the source nodes before refresh decrease the amount of harvesters we need
    var sources = Game.rooms[room].memory.sources;
    var requiredHarvesters = 0;

    for(var source in sources){

        var node = Game.getObjectById(sources[source].nodeID);

        if(node.ticksToRegeneration == 20 && node.energy == 0)
        {
            if(sources[source].minimumQuantity != 1){
                Game.rooms[room].memory.sources[source].minimumQuantity -= 1;
            }
        }
        else{
            if(node.ticksToRegeneration == 20 && node.energy > 0){

                var quantity = Game.rooms[room].find(FIND_MY_CREEPS, {
                    filter: (creep) => (
                        creep.memory.assignedNode == sources[source].nodeID
                    )
                })

                //Don't require an additional harvester if we didn't drain due to a dead harvester
                if(sources[source].minimumQuantity < sources[source].max && quantity.length > 0){
                    Game.rooms[room].memory.sources[source].minimumQuantity += 1;
                }
            }
        }

        requiredHarvesters += sources[source].minimumQuantity;
    }

    Game.rooms[room].memory.roomRequiredHarvesters = requiredHarvesters;
}

function setupLinks(room){
    //Check to see if room has links defined, if not try and locate and define links
    if(Game.rooms[room].memory.collectLinks == undefined) {

        var links = [];
        Game.rooms[room].memory.collectLinks = links;
    }
    if(Game.rooms[room].memory.depositLinks == undefined) {

        var links = [];
        Game.rooms[room].memory.depositLinks = links;
    }

    var links = Game.rooms[room].find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_LINK
    });

    if(links.length > 0) {

        if (links.length != Game.rooms[room].memory.depositLinks.length + Game.rooms[room].memory.collectLinks.length) {

            for (var link in links) {

                if (Game.flags.collectLink != undefined) {

                    if (Game.flags.collectLink.pos.isEqualTo(links[link].pos)) {

                        if (Game.rooms[room].memory.collectLinks.includes(links[link].id) != undefined) {
                            Game.rooms[room].memory.collectLinks.push(links[link].id);
                            Game.flags.collectLink.remove();
                        }
                        else {
                            console.log("Marked collection link already logged");
                        }
                    }
                }

                if (Game.flags.depositLink != undefined) {

                    if (Game.flags.depositLink.pos.isEqualTo(links[link].pos)) {

                        if (Game.rooms[room].memory.depositLinks.includes(links[link].id) != undefined) {
                            Game.rooms[room].memory.depositLinks.push(links[link].id);
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
}

function setupSourceNodes(room){
    //setup accessible source node points across the rooms
    if(Game.rooms[room].memory.sources == undefined){

        var sources = Game.rooms[room].find(FIND_SOURCES);
        var sourceIDs = []
        var roomRequiredHarvesters = 0;

        for(var source in sources){

            var accessPoints = 0;
            var area = [];

            area = Game.rooms[room].lookForAtArea(LOOK_TERRAIN, sources[source].pos.y - 1, sources[source].pos.x - 1, sources[source].pos.y + 1, sources[source].pos.x + 1, true);

            for(var x in area){
                if(area[x].terrain != 'wall'){
                    accessPoints++;
                }
            }

            var data = {
                nodeID: sources[source].id,
                max: accessPoints,
                minimumQuantity: accessPoints,
            };

            roomRequiredHarvesters += accessPoints;
            sourceIDs.push(data);
        }

        Game.rooms[room].memory.roomRequiredHarvesters = roomRequiredHarvesters;
        Game.rooms[room].memory.sources = sourceIDs;
        Game.rooms[room].memory.sourceNodes = sources.length;
    }
}

function setupRecycling(room){

    //Recycle gains were not efficient for breaking hauler path routines
    //If this is reactivated also reactivate recycle portion of roles.retired
    /*if(Game.rooms[room].memory.recyclePoint == null){
        var spawns = Game.rooms[room].find(FIND_MY_SPAWNS);

        if(spawns.length > 0){
            var containers = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER)
                }
            });

            for(var container in containers){
                for(var spawn in spawns){
                    if(spawns[spawn].pos.getRangeTo(containers[container].pos) == 1){
                        Game.rooms[room].memory.recyclePoint = containers[container].id;
                        Game.rooms[room].memory.recycleSpawn = spawns[spawn].id;
                    }
                }
            }
        }
    }*/
}

function setupRooms(room) {
    setupSourceNodes(room);
    setupLinks(room);
    //setupRecycling(room);
}

module.exports = {
    run: function(){

        for(var room in Game.rooms){
            setupRooms(room);
            sourceMonitor(room);
        }

    }
};