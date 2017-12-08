var runCreeps = require('run.creeps');
var runStructures = require('run.structures');

module.exports.loop = function () {


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

