var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    passwprd: '',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;

    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);

        productId(res);


        // connection.end();
    });
}

function productId(items) {
    inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'What is the id of the product you would like to buy?\n'
        }

    ]).then(function (answer) {

        var selectedId = parseInt(answer.id);
        var product = checkInventory(selectedId, items);
        // var product = true;
        if (product) {
            inquirer.prompt(
                {
                    name: 'quantity',
                    type: 'input',
                    message: 'How many units would you like to purchase?'
                }
            ).then(function (answer) {
                var desiredQuantity = parseInt(answer.quantity);
                if (desiredQuantity > product.stock_quantity) {
                    console.log('Oh no! Insufficient quantity.');
                    afterConnection();
                } else {
                    purchaseItem(desiredQuantity, product);
                }
            })

        }

    });
}

function purchaseItem(desiredQuantity, product) {
    var queryString = 'UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id = ?';
    connection.query(queryString, [desiredQuantity,], function (err, res) {
    })
};

function checkInventory(selectedId, items) {
    for (var i = 0; i < items.length; i++) {
        if (selectedId === items[i].item_id) {
            return items[i];
        }
    }
    return null;
}

