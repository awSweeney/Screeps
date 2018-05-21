/* Collection of common actions carried out by creeps */

var actionCreep = {

    travelTo: function(creep, target){
        //ToDo, reuse pathing, creep target, to save cpu
        creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0000'}});
        
    },

    collectFromLink: function(creep){

        if(creep.room.memory.collectLinks.length > 0){

            for(var link in creep.room.memory.collectLinks){

                var target = Game.getObjectById(creep.room.memory.collectLinks[link]);

                if (target.energy > 0) {
                    if (creep.withdraw(target, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                        this.travelTo(creep, target);
                    }

                    return true;
                }
            }

        }

        return false;
    },

    collectMineral: function(creep, target){
    
        if(creep.harvest(target) == ERR_NOT_IN_RANGE){
            this.travelTo(creep, target);
        }
    },

    collectFromLinkInRangeOf: function(creep, target, range, waitOnCapacity){

        if(creep.room.memory.collectLinks.length > 0){

            var linkFound = false;

            for(var link in creep.room.memory.collectLinks){

                var currentLink = Game.getObjectById(creep.room.memory.collectLinks[link]);

                    if(target.length != undefined){

                        for(var object in target){

                            if(target[object].pos.getRangeTo(currentLink.pos) <= range){

                                if(currentLink.energy > 0){

                                    if (creep.withdraw(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        this.travelTo(creep, currentLink);
                                    }

                                    return true;
                                }
                                else{
                                    linkFound = true;
                                }

                            }
                        }
                    }
                    else{
                        if(target.pos.getRangeTo(currentLink.pos) <= range){

                            if(currentLink.energy > 0){

                                if (creep.withdraw(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    this.travelTo(creep, currentLink);
                                }

                                return true;
                            }
                            else{
                                linkFound = true;
                            }

                        }
                    }
            }

            if(linkFound && waitOnCapacity){
                return true;
            }
        }

        return false;
    },

    collectFromExtensions: function(creep) {


        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (
                                s.structureType == STRUCTURE_EXTENSION)
                                && s.energy > 0
        });

        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                this.travelTo(creep, EnergyStructures);
            }

            return true;
        }

        return false;
    },

    collectFromStorage: function(creep){

        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_STORAGE)
                && _.sum(s.store) > 0

        })
        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                this.travelTo(creep,EnergyStructures);
            }

            return true;
        }

        return false;
    },

    collectFromContainer: function(creep){

        var EnergyStructures = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_CONTAINER)
                && _.sum(s.store) > 0

        })

        if(EnergyStructures != undefined){

            if(creep.withdraw(EnergyStructures, RESOURCE_ENERGY, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                this.travelTo(creep, EnergyStructures);
            }

            return true;
        }

        return false;
    },
    
    findLinksInRangeOf: function(target, range, waitOnCapacity){

        for(var structure in target){

            for(var link in target[structure].room.memory.depositLinks) {

                var link = Game.getObjectById(target[structure].room.memory.depositLinks[link]);
                var rangeTest = target[structure].pos.getRangeTo(link);

                if(rangeTest <= range){
                    if(link.energy < link.energyCapacity){
                        return true;
                    }
                    else{
                        if(waitOnCapacity){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }
                else{
                    return false;
                }
            }
        }
    },

    depositToLink: function(creep){

        if(creep.room.memory.depositLinks.length > 0){

            for(var link in creep.room.memory.depositLinks){

                var rangeTest = creep.pos.getRangeTo(Game.getObjectById(creep.room.memory.depositLinks[link]));

                if(rangeTest <= 3){

                    if (creep.transfer(Game.getObjectById(creep.room.memory.depositLinks[link]), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.travelTo(creep, Game.getObjectById(creep.room.memory.depositLinks[link]));
                    }
                    return true;
                }
            }
            return false;
        }

        return false;
    },

    depositToLinkInRangeOf: function(creep, target, range, waitOnCapacity){

        var linkFound = false;

        if(creep.room.memory.depositLinks.length > 0){



            for(var link in creep.room.memory.depositLinks){

                var currentLink = Game.getObjectById(creep.room.memory.depositLinks[link]);

                    if(target.length != undefined){

                        for(var object in target){

                            if(target[object].pos.getRangeTo(currentLink) <= range){

                                if(currentLink.energy != currentLink.energyCapacity){

                                    if (creep.transfer(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        this.travelTo(creep, currentLink);
                                    }

                                    return true;
                                }
                                else{
                                    linkFound = true;
                                }

                            }
                        }
                    }
                    else{
                        if(target.pos.getRangeTo(currentLink) <= range){

                            if(currentLink.energy != currentLink.energyCapacity){

                                if (creep.transfer(currentLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    this.travelTo(creep, currentLink);
                                }

                                return true;
                            }
                            else{
                                linkFound = true;
                            }

                        }
                    }
            }
        }

        if(waitOnCapacity && linkFound){
            return true;
        }

        return false;
    },

    depositToExtensions: function (creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION)
                    && structure.energy < structure.energyCapacity;
            }
        });

        if (target != undefined) {

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.travelTo(creep, target);
            }

            return true;
        }

        return false;
    },
    
    depositToTerminal: function(creep){
        //Generic dump everything into terminal
        
        if(Game.rooms[creep.memory.home].terminal != undefined){
            
            var target = Game.rooms[creep.memory.home].terminal;
            
            if(_.sum(target.store) < target.storeCapacity){
                for(const resourceType in creep.carry) {
                    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE){
                        this.travelTo(creep, target);
                    }
                }

                return true;
            }
        }
        
        return false;
    },
    
    depositEnergyToTerminal: function(creep){
        //Hard cap on how much energy we're investing into the terminal
        
        if(Game.rooms[creep.memory.home].terminal != undefined){
            
            var target = Game.rooms[creep.memory.home].terminal;
            
            if(target.store[RESOURCE_ENERGY] < 2500 && _.sum(target.store) < target.storeCapacity){
                for(const resourceType in creep.carry) {
                    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE){
                        this.travelTo(creep, target);
                    }
                }

                return true;
            }
        }
        
        return false;
    },

    depositToStorage: function (creep) {
        //Generic dump everything into storage

        if (Game.rooms[creep.memory.home].storage != undefined) {
            
            var target = Game.rooms[creep.memory.home].storage;

            if(_.sum(target.store) < target.storeCapacity){
                for(const resourceType in creep.carry) {
                    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE){
                        this.travelTo(creep, target);
                    }
                }

                return true;
            }
            
        }

        return false;
    },

    depositToContainer: function (creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(structure.store) < structure.storeCapacity;
            }
        });

        if (target != undefined) {

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.travelTo(creep, target);
            }

            return true;
        }

        return false;
    },

    depositToSpawn: function (creep) {

        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
            }
        });


        if(target != undefined){
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.travelTo(creep, target);
            }

            return true;
        }

        return false;
    }
};
module.exports = actionCreep;