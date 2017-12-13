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

                var quantity = spawn.room.find(FIND_MY_CREEPS, {
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


function setupRooms(room) {

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


module.exports = {
    run: function(){

        for(var room in Game.rooms){
            setupRooms(room);
            sourceMonitor(room);
        }

    }
};