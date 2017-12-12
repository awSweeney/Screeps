//Quick all purpose creep that will go to a claim flag to kickstart a room until it's self sustaining

var rolePioneer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 collect');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🔨 build');
        }

        if(Game.flags.claim != undefined){
            let targetRoomName = Game.flags.claim.room;

            if(targetRoomName != undefined && creep.pos.roomName == targetRoomName.name){

                if(!creep.memory.building){

                    if (creep.carry.energy < creep.carryCapacity) {

                        var sources = creep.room.find(FIND_SOURCES);

                        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
                else{
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                    if(targets.length > 0) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else{
                        if(creep.upgradeController(Game.rooms[targetRoomName.name].controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.rooms[targetRoomName.name].controller, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }

            }
            else{
                creep.moveTo(Game.flags.claim, {visualizePathStyle: {stroke: '#FF0000'}});
            }

        }


    }
};

module.exports = rolePioneer;