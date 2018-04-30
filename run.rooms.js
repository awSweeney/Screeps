//const typesThatCanRequestRoads = ["harvester", "hauler", "upgrader"];

function sourceMonitor(room){

    var spawnCheck = Game.rooms[room].find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN)
                }
    });

    //Don't care about setting this up if we don't have a spawn in the room
    if(spawnCheck.length > 0){
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

function initialSetup(room){
    //Fills memory with all the things the room uses to function as well as creates the initial room road and container layout
    
    var spawnCheck = Game.rooms[room].find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN)
                }
    });
    
    //No need to set this up if we don't have a spawn in the room
    if(spawnCheck.length > 0){
        
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
                
                
                //request containers and roads for the source nodes
                var pathfinder = PathFinder.search(Game.getObjectById(data.nodeID).pos, spawnCheck[0].pos);
                
                for(var node in pathfinder.path){
                    var position = JSON.stringify(pathfinder.path[node]);
                    if(node == 0){
                        requestConstruction(STRUCTURE_CONTAINER, position);
                    }
                    else{
                       requestConstruction(STRUCTURE_ROAD, position); 
                    }
                }
            }
    
            Game.rooms[room].memory.roomRequiredHarvesters = roomRequiredHarvesters;
            Game.rooms[room].memory.sources = sourceIDs;
            Game.rooms[room].memory.sourceNodes = sources.length;
            
            //This is the first time the room is being setup so setup roads to the controller as well
            var pathfinder = PathFinder.search(Game.rooms[room].controller.pos, spawnCheck[0].pos);
            for(var node in pathfinder.path){
                var position = JSON.stringify(pathfinder.path[node]);
                requestConstruction(STRUCTURE_ROAD, position);
            }
        }
        
    }
}

//function setupRecycling(room){

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
//}

//If you want your floor covered in roads, letting creeps request roads is a great idea
/*function updateRoadQueue(){
    
    
    if(Memory.roadQueue == null){
       Memory.roadQueue = new Array();  
    }
    
    
    for(var name in Game.creeps) {

        var creep = Game.creeps[name];
        var authorizedCreep = (typesThatCanRequestRoads.indexOf(creep.memory.role) > -1)
        
        if(authorizedCreep){
            var roadFound = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
            var constructionFound = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos);
            
            
            if(!roadFound.length && !constructionFound.length){
               
               var position = JSON.stringify(creep.pos);
               var dupeCheck = Memory.roadQueue.indexOf(position);

               if(dupeCheck == -1){
               
                   Memory.roadQueue.push(position);
               }
               else{
                   Memory.roadQueue.splice(dupeCheck,1);
                   requestConstruction(STRUCTURE_ROAD, position);
               }
            }
        }
    }
}*/

function updateBuildQueue(room){
    /*
    Updates a build queue for each room that builders will get orders from.
    TODO: if the bot ever becomes automated enough, update this to not scan for
    construction sites and update off constructionManager() pops
    */
    
    //Easy way to prioritize roads last, concat at the end of the list
    var nonRoads = Game.rooms[room].find(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => (
                        s.structureType != STRUCTURE_ROAD)
    });
            

    var roads = Game.rooms[room].find(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => (
                        s.structureType == STRUCTURE_ROAD)
    });
    
    var buildQueue = new Array();
    
    //For effciency sake we only need the id of the site
    for(var site in nonRoads){
        buildQueue.push(nonRoads[site].id);
    }
    
    for(var site in roads){
        buildQueue.push(roads[site].id)
    }
    
    Game.rooms[room].memory.buildQueue = buildQueue;
}

function requestConstruction(type, location){
    //Submits a contruction request to the construction queue in root memory if valid 
    
    if(Memory.constructionQueue == null){
        Memory.constructionQueue = new Array();
    }
    
    var dupeCheck= Memory.constructionQueue.map(function(key) { return key.location; }).indexOf(location);
    
    if(dupeCheck == -1){
       var request = {
            structure: type,
            position: location
        }
        
        Memory.constructionQueue.push(request); 
    }
}

function constructionManager(){
    //Takes a request from construction queue in root memory and places the construction site if not maxed on available construction sites

    if(Memory.constructionQueue != null){
    
        if(Memory.constructionQueue.length > 0){
            
            var sites = 0;
            
            for(var room in Game.rooms){
               sites += Game.rooms[room].find(FIND_CONSTRUCTION_SITES, { filter: (s) => s.my == true}).length;
            }
            
            
            if(sites < MAX_CONSTRUCTION_SITES){
               var buildSpace = MAX_CONSTRUCTION_SITES - sites;
               
               for(i = 0; i < buildSpace && Memory.constructionQueue.length > 0; i++){
                   var request = Memory.constructionQueue.shift();
                   var buildPos = JSON.parse(request.position);
       
                   Game.rooms[buildPos.roomName].createConstructionSite(buildPos.x, buildPos.y, request.structure); 
               }
            }
        }
    }
}

function buildExtensionFlower(room){
    
    /*
      Attempt to build the extension grid
      TODO: Make this better when we're not under attack
    */
    
    var spawn = Game.rooms[room].find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_SPAWN)
                }
    });
    
    
    if(spawn.length > 0){
       
        var startRow = 4; //Amount of spaces between the spawn and the first row of extensions
        var spacing = 2; //Spacing in between extensions
        var currentPos = new RoomPosition(spawn[0].pos.x, spawn[0].pos.y, spawn[0].pos.roomName); //Where we attempt to build the first extension
        currentPos.x -= startRow;
        currentPos.y -= startRow;
        var flagnum = 1;
        var maxRowCheck = 24; //Room is 48 across
        
        //Combine the amount of extensions currently building, with the amount already built to determine how many we can build
        var extensionsBuilt = Game.rooms[room].find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION)
                }
        });
        
        var extensionsBuilding = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION)
                }
        });
        
        var extensionAllowance = determineExtensionAllowance(room);
        
        if(extensionsBuilt.length){
            extensionAllowance -= extensionsBuilt.length; 
        }
        
        if(extensionsBuilding.length){
            extensionAllowance -= extensionsBuilding.length;
        }
        
        //Rotate around the flower pattern until we find a suitible spot
        if(extensionAllowance > 0){
            
            for(var z = 0; z < maxRowCheck && extensionAllowance > 0; z++){
            
                for(i = 0; i < startRow && extensionAllowance > 0; i++){
                    currentPos.x += spacing;
                    if(validConstructionSite(room, currentPos)){
                        var position = JSON.stringify(currentPos);
                        requestConstruction(STRUCTURE_EXTENSION, position);
                        extensionAllowance--;
                    }
                }
                
                for(i = 0; i < startRow && extensionAllowance > 0; i++){
                    currentPos.y += spacing;
                    if(validConstructionSite(room, currentPos)){
                        var position = JSON.stringify(currentPos);
                        requestConstruction(STRUCTURE_EXTENSION, position);
                        extensionAllowance--;
                    }
                }
                
                for(i = 0; i < startRow && extensionAllowance > 0; i++){
                    currentPos.x -= spacing;
                    if(validConstructionSite(room, currentPos)){
                        var position = JSON.stringify(currentPos);
                        requestConstruction(STRUCTURE_EXTENSION, position);
                        extensionAllowance--;
                    }
                }
                
                for(i = 0; i < startRow && extensionAllowance > 0; i++){
                    currentPos.y -= spacing;
                    if(validConstructionSite(room, currentPos)){
                        var position = JSON.stringify(currentPos);
                        requestConstruction(STRUCTURE_EXTENSION, position);
                        extensionAllowance--;
                    }
                }
                
                currentPos.x -= 1;
                currentPos.y -= 1;
                startRow += 1;
            }
        }
        
        
        extensionsBuilding = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION)
                }
        });
        
        //Build the roads to go with the new extensions
        if(extensionsBuilding.length > 0){
            
            for(var extension in extensionsBuilding){

                const extensionPosition = new RoomPosition(extensionsBuilding[extension].pos.x, extensionsBuilding[extension].pos.y, extensionsBuilding[extension].pos.roomName);

                var roadPosition = new RoomPosition(extensionPosition.x, extensionPosition.y, extensionPosition.roomName);
                roadPosition.x += 1;
                if(validConstructionSite(room, roadPosition)){
                  requestConstruction(STRUCTURE_ROAD, JSON.stringify(roadPosition));  
                }
                
                roadPosition = new RoomPosition(extensionPosition.x, extensionPosition.y, extensionPosition.roomName);
                roadPosition.y += 1;
                if(validConstructionSite(room, roadPosition)){
                  requestConstruction(STRUCTURE_ROAD, JSON.stringify(roadPosition));  
                }
                
                roadPosition = new RoomPosition(extensionPosition.x, extensionPosition.y, extensionPosition.roomName);
                roadPosition.x -= 1;
                if(validConstructionSite(room, roadPosition)){
                  requestConstruction(STRUCTURE_ROAD, JSON.stringify(roadPosition));  
                }
                
                roadPosition = new RoomPosition(extensionPosition.x, extensionPosition.y, extensionPosition.roomName);
                roadPosition.y -= 1;
                if(validConstructionSite(room, roadPosition)){
                  requestConstruction(STRUCTURE_ROAD, JSON.stringify(roadPosition));  
                }
            }
        }
        
    }
}

function determineExtensionAllowance(room){
    //Amount of extensions allowed at each room level
    switch(Game.rooms[room].controller.level){
        case 8:
            return 60;
            break;
        case 7:
            return 50;
            break;
        case 6:
            return 40;
            break;
        case 5:
            return 30;
            break;
        case 4:
            return 20;
            break;
        case 3:
            return 10;
            break;
        case 2:
            return 5;
            break;
        default:
            return 0;
    }
}

function validConstructionSite(room, position){
    //Check to see if a spot is a valid construction site. Will remove roads if that's the object obstructing construction
    var look = Game.rooms[room].lookForAt(LOOK_TERRAIN, position);
    
    //Is it a wall?
    if(look.length){
        if(look != 'wall'){
            //Is there a structure there? if it's a road kill it
            look = Game.rooms[room].lookForAt(LOOK_STRUCTURES, position);
            var lookConstruction = Game.rooms[room].lookForAt(LOOK_CONSTRUCTION_SITES, position);
            
            if(look.length){
                if(look[0].structureType == STRUCTURE_ROAD){
                    look[0].destroy()
                    return true;
                }
            }
            else{
                if(lookConstruction.length == 0){
                   return true; 
                }
            }
        }
    }
    
    return false;
}


function setupRooms(room) {
    initialSetup(room);
    setupLinks(room);
    //setupRecycling(room);
    //updateRoadQueue();
    
    //Use this to stagger when rooms run the expensive stuff, room variation makes it run on different ticks
    //Pulls the last 2 digits from the room name
    var roomSetupVariation = room.substring(4,6);
    if(Game.time % (600 + roomSetupVariation) == 0){
        buildExtensionFlower(room); 
    }
    //Pulls the last digit from the room name for smaller variations
    roomSetupVariation = room.substring(5,6);
    if(Game.time % (25 + roomSetupVariation) == 0){
        updateBuildQueue(room);
    }
    
}

module.exports = {
    run: function(){

        for(var room in Game.rooms){
            setupRooms(room);
            sourceMonitor(room);
        }
        
        if(Game.time % 100 == 0){
           constructionManager(); 
        }
        
    }
};