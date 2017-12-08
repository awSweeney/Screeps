/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.link');
 * mod.thing == 'a thing'; // true
 */
var link = {
    run: function(){
        var link = Game.getObjectById("5a2344739ce0454d5bea1e6a");
        var dlink = Game.getObjectById("5a243674baad905ff5f287ca");

        if(link.cooldown == 0) {
            link.transferEnergy(dlink, link.energy - dlink.energy);
        }
    }
};


module.exports = link;