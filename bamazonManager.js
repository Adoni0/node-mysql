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

    start();
});

function start() {
    inquirer.prompt(
        {
            name: 'manager',
            type: 'list',
            message: 'Hello Manager! What would ypou like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Products']
        }
    ).then(function (answer) {
        if (answer.manager === 'View Products for Sale') {
            viewProducts();
        }

        else if (answer.manager === 'View Low Inventory') {
            viewLowInventory();
        }

        else if (answer.manager === 'Add to Inventory') {
            addInventory();
        }

        else if (answer.manager === 'Add New Products') {
            addProducts();
        }

        else {
            connection.end();
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
};

function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}

function addInventory(items) {
    inquirer.prompt(
        {
            name: 'inventory',
            type: 'input',
            message: 'What is the id of the product you would like to add to?'
        }

    ).then(function (answer) {

        var selectedId = parseInt(answer.inventory);
        var product = matchId(selectedId, items);

        if (product) {
            inquirer.prompt(
                {
                    name: 'update',
                    type: 'input',
                    message: 'How many units would you like to add?'
                }
            ).then(function (answer) {
                var quantity = parseInt(answer.update);
                connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?', [quantity, product], function (err, res) {
                    if (err) throw err;

                    console.log('Units Added!');
                    connection.end();
                })
            })
        }

    })
};


function matchId(selectedId, items) {
    for (var i = 0; i < items.length; i++) {
        if (selectedId === items[i].item_id) {
            return items[i].item_id;
        }
    }
    return null;
}


function addProducts(){
    inquirer.prompt([
        {
        name: 'product',
        type: 'input',
        message: 'What is the name of the product you would like to add?'
    },
    {
        name: 'department',
        type: 'input',
        message: 'What department does the product belong to?'
    },
    {
        name: 'price',
        type: 'input',
        message: 'What price would you like the product listed as?'
    },
    {
        name: 'stock',
        type: 'input',
        message: 'How many units would you like to add?'
    }

]).then(function(answer){
    var priceInput = parseInt(answer.price);
    var stockInput = parseInt(answer.stock);

        connection.query('INSERT INTO products SET ?', 
        {
            product_name: answer.product,
            department_name: answer.department,
            price: priceInput,
            stock_quantity: stockInput
        }, 
        function(err, res){
            if(err) throw err;

            console.log('Your product was added!');
            connection.end();

        })
    })
}