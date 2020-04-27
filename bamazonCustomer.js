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
    console.log("connected as id " + connection.threadId);
    afterConnection();
})

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
        
        connection.end();
      });
}