module.exports = {
    travelTo: function(creep, target){

        creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0000'}});
        
    }
};