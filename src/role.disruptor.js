/*This was used early on in the game as a way to starve freshly spawned players by blocking access to their energy nodes.
Not used as of 1.2 but keeping here incase we want to reimplement */

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