var roleRangedDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.attacking) {
            creep.say('⚔');
        }
        if(!creep.memory.attacking) {
            creep.say('💤');
        }

        //Prioritize Healers
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
            filter: function(object){
                return object.getActiveBodyparts(HEAL) > 0;
            }
        });

        

        //Other creep types
        if(target == undefined){

            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (target) => (FRIENDLY_PLAYERS.toLowerCase().search(target.owner.username.toLowerCase()) != -1) ||
                                    target.name.toLowerCase().search('invader_') != -1
            });
        }

        if(target != undefined){
            //Go fight
            creep.memory.attacking = true;

            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0000'}});
            }
        }
        else{

            //Goto a location if nothing to fight
            creep.memory.attacking = false;
            creep.moveTo(Game.flags.standby);

        }

    }
};

module.exports = roleRangedDefender;