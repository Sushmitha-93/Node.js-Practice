let express = require('express')
let bodyParser = require('body-parser')
let mongodb = require('mongodb')
let path = require('path')

//var jsdom = require("jsdom");
//var JSDOM = jsdom.JSDOM;

//document = new JSDOM(html).window.document;

let myServer = express()
myServer.use(bodyParser.urlencoded({
    extended: false
}))

let mongoClient = mongodb.MongoClient;


let url = "mongodb://localhost:27017/employee"
let dbName = "employee"

let empno, name, company, action
var count, message

myServer.post("/", function(req, res) {
        console.log("QUERY STRING: ", req.body)

        empno = parseInt(req.body.empno)
        name = req.body.name
        company = req.body.company
        action = req.body.action

        //connect to Mongo client
        mongoClient.connect(url, function(err, client) {
            if (err) {
                console.log("Unable to connect: ", err)
            } else {
                console.log("Connected Successfully !!")

                const db = client.db(dbName);
                if (action == "Insert")
                    insert();
                if (action == "Update")
                    update();
                if (action == "Display")
                    display();

                function insert() {
                    db.collection('empDetails').insertOne({
                        empno: empno,
                        name: name,
                        company: company
                    }, function(err, insertedRecs) {
                        count = insertedRecs.insertedCount;
                        res.send("<h1 aligh=center>Inserted " + count + " Successfully</h1>")
                        res.end()
                    })
                }

                function update() {
                    db.collection('empDetails').updateOne({
                        empno: empno
                    }, {
                        $set: {
                            name: name,
                            company: company
                        }
                    }, function(err, updatedRecs) {
                        count = updatedRecs.modifiedCount;
                        res.send("<h1 align=center>Updated " + count + " Successfully</h1>");
                        res.end();
                    })
                }


                function display() {
                    db.collection('empDetails').find().toArray(function(err, data) {
                        console.log(data)

                        myServer.set('views', path.join(__dirname, 'views'));
                        myServer.set('view engine', 'jade')


                        res.render('index', {
                            title: 'Hello World!'
                        });

                        res.end();
                    })

                }


                client.close()
            }

        })
    })
    /*
    function jsonToTable(emps) {
        var col = [];
        for (var i = 0; i < emps.length; i++) {
            for (var key in emps[i]) {
                if (col.indexOf(key) == -1)
                    col.push(key)
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        var tr = table.insertRow(-1); // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th"); // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < emps.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = emps[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

    }
    */

myServer.listen(8080, () => console.log("listening to 8080"))