const Terminal_Energy_StockPile = 1500;
const Mineral_Excess = 2000;

function autoSellMinerals(room){
    
    if (Game.rooms[room].terminal) {
        for(var resource in Game.rooms[room].terminal.store){
            if(resource != RESOURCE_ENERGY){
                if (Game.rooms[room].terminal.store[RESOURCE_ENERGY] >= Terminal_Energy_StockPile && Game.rooms[room].terminal.store[resource] >= Mineral_Excess) {
                    var orders = Game.market.getAllOrders(order => order.resourceType == resource &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room, order.roomName) < 400);
                    console.log(resource + ' buy orders found: ' + orders.length);
                    if(orders.length > 0){
                                        orders.sort(function(a,b){return b.price - a.price;});
                        console.log('Best price: ' + orders[0].price);
                        var result = Game.market.deal(orders[0].id, 200, room);
                        if (result == 0) {
                            console.log('Order completed successfully');
                        }
                    }
                }
            }
            
        }
    }
}



module.exports = {
    run: function(){

        if(AUTO_SELL_MINERALS){
            for(var room in Game.rooms){
                autoSellMinerals(room);
            }
        }
    }
};