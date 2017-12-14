module.exports = {
    travelTo: function(creep, target){

        creep.moveTo(target);

        /*if(creep.memory.path == undefined){
            creep.memory.path = creep.pos.findPathTo(target, {maxOps: 1000, ignoreCreeps: true});
        }
        else{
            if(creep.pos.getRangeTo(target) > 5){
                creep.moveByPath(creep.memory.path);
            }
            else{
                creep.moveTo(target);
            }

        }*/
    }
};