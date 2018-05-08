var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.attacking) {
            creep.say(EMOJI_HEALING);
        }
        if(!creep.memory.attacking) {
            creep.say(EMOJI_SLEEP);
        }

        var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (target) => (target.hits < target.hitsMax)
            }
        );


        if(target != undefined){

            creep.memory.attacking = true;
            if(creep.heal(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);

            }
        }
        else{
            //Goto a location if nothing to fight
            creep.memory.attacking = false;

            if(Game.flags.attack != undefined){
                creep.moveTo(Game.flags.attack, {visualizePathStyle: {stroke: '#FF0000'}});
            }
            else{
                creep.moveTo(Game.flags.standby);
            }
        }

    }
};

module.exports = roleHealer;