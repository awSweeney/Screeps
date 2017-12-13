var runCreeps = require('run.creeps');
var runStructures = require('run.structures');
var runRooms = require('run.rooms');

module.exports.loop = function () {


    try{
        runRooms.run();
    }
    catch(err){
        console.log("Error in setup routine: " + err);
    }


    try {
        runStructures.run();
    }
    catch(err){
        console.log("Error in structures routine: " + err);
    }


    try{
        runCreeps.run();
    }
    catch(err){
        console.log("Error in creeps routine: " + err);
    }

}

