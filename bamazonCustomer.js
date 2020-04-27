var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    passwprd: '',
    database: 'bamazon_db'
});

connection.connect(function(err){
    if(err) throw err;
    
    afterConnection();
});

function afterConnection(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            console.log('Item id: ' + res[i].item_id);
            console.log('Product: ' + res[i].product_name);
            console.log('Department: ' + res[i].department_name);
            console.log('Price: ' + '$' + res[i].price);
            console.log('Stock Quantity: ' + res[i].stock_quantity);
            console.log('--------------------------------------------');
        }
        
        // connection.end();
      });
}

function productId(){
    inquirer.prompt([
        {
        name: 'id',
        message: 'What is the id of the product you would like to buy?'
    },
    {
        name: 'quantity',
        message: 'How many units would you like to purchase?'
    }
]).then(function(answer){
        var query = connection.query('SELECT * FROM products WHERE ?', [answer.id, answer.quantity], (err, res) => {
            if (err) {
                throw err;
            }
            // console.log(res);
            for(var i = 0; i < res.length;i++){
                if(answer.id === res[i].item_id){
                    var queryString = 'UPDATE products SET stock_quantity = stock_quantity -' + [answer.quantity] + 'WHERE ' + 'item_id =' + [answer.id];
                    connection.query(queryString, function(err, res){
                        console.log('Your purchase was successful!');
                    });
                    
                } else if(answer.quantity > res[i].stock_quantity){
                    console.log('Oh no! Insufficient quantity.');
                }
            }
           
        });
    });
}
productId();