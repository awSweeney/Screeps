var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.attacking) {
            creep.say('💚 Healing');
        }
        if(!creep.memory.attacking) {
            //creep.say('💤 Standby');
        }

        var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (target) => (target.hits < target.hitsMax)
            }
        );


        if(target != undefined){

            creep.memory.attacking = true;
            console.log(target.hits);
            if(creep.heal(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);

            }
        }
        else{
            creep.memory.attacking = false;
            var posInAnotherRoom = new RoomPosition(6, 15, 'W37N21');
            creep.moveTo(posInAnotherRoom, {visualizePathStyle: {stroke: '#ffffff'}});
            //creep.moveTo(Game.flags.standby);
        }

    }
};

module.exports = roleHealer;