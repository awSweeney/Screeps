var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(Game.flags.claim != undefined){
            var targetRoomName = Game.flags.claim.room;

            if(targetRoomName != undefined){
                if(creep.claimController(Game.rooms[targetRoomName.name].controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.rooms[targetRoomName.name].controller);
                }
                else{
                    creep.signController(Game.rooms[targetRoomName.name].controller, "Claimed by:");
                }
            }
            else{
                creep.moveTo(Game.flags.claim, {visualizePathStyle: {stroke: '#FF0000'}});
            }

        }


    }
};

module.exports = roleClaimer;