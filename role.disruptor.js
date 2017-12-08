var roleDisruptor = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //Temp class to block off resource nodes

        if(Game.flags.block != undefined){
            creep.moveTo(Game.flags.block, {visualizePathStyle: {stroke: '#FF0000'}});
        }


    }
};

module.exports = roleDisruptor;