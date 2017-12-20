const SOLDIER_QTY = 2;
const WARRIORS_PER_HEALER = 2;

module.exports = {

    soldier: function(spawn, energy){

        var memory = {memory: {role: 'soldier'}};
        var name = 'soldier'
        var body = [];

        var minimumQuantity = function(){
            return SOLDIER_QTY;
        };

        var quantity =  _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier');


        if(quantity.length < minimumQuantity()) {
            var allowance = Math.floor(energy / 200);

            if (allowance >= 1) {
                for (var x = 0; x < allowance; x++) {
                    body.push(TOUGH);
                    body.push(TOUGH);
                    body.push(MOVE);
                    body.push(MOVE);
                    body.push(ATTACK);
                }

                if(Game.spawns[spawn].spawnCreep(body, name + Game.time, memory) == OK){
                    return true;
                }
            }
        }

        return false;
    },

    healer: function(spawn, energy){

        var memory = {memory: {role: 'healer'}};
        var name = 'healer'
        var body = [];

        var minimumQuantity = function(){

            var quantity =  _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier');

            quantity = quantity.length / WARRIORS_PER_HEALER;

            return quantity >= 0 ? Math.ceil(quantity) : Math.floor(quantity);
        };

        var quantity =  _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

        if(quantity.length < minimumQuantity()) {
            var allowance = Math.floor(energy / 370);

            if (allowance >= 1) {
                for (var x = 0; x < allowance; x++) {
                    body.push(TOUGH);
                    body.push(TOUGH);
                    body.push(MOVE);
                    body.push(MOVE);
                    body.push(HEAL);
                }

                if(Game.spawns[spawn].spawnCreep(body, name + Game.time, memory) == OK){
                    return true;
                }
            }
        }

        return false;
    }

};