var roleRangedSoldier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.attacking) {
            creep.say(EMOJI_RANGED);
        }
        if(!creep.memory.attacking) {
            creep.say(EMOJI_SLEEP);
        }

        //Prioritize Healers
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
            filter: (target) => (target.getActiveBodyparts(HEAL) > 0 &&
                                    FRIENDLY_PLAYERS.toLowerCase().indexOf(target.owner.username.toLowerCase()) == -1) ||
                                    target.name.toLowerCase().search('invader_') != -1
        });

        //Other creep types
        if(target == undefined){
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => (FRIENDLY_PLAYERS.toLowerCase().indexOf(target.owner.username.toLowerCase()) == -1) ||
                                    target.name.toLowerCase().search('invader_') != -1
            });
        }


        if(target != undefined){

            creep.memory.attacking = true;

            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0000'}});
            }
        }
        else{
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

module.exports = roleRangedSoldier;