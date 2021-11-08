// add dependencies
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan")
const mysql = require("mysql");
const path = require("path");

// add config
const setup = require('./config/db_connect');
const port = process.env.PORT || 3000;

// middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(morgan("dev"))


const pool = mysql.createPool(setup);


app.get("/", (req, res) => {
    res.send("api페이지 입니다");
});

app.post("/login", (req, res) => {
    // /login POST BODY(JSON(id:1,password:1))
    const id = req.body["id"];
    const password = req.body["pwd"];

    pool.getConnection(function (err, conn) {
        if (!err) {
            conn.query(
                `select * from test where id = ? and pwd = ?`,
                [id, password],
                function (err, result) {
                    if (err) res.status(400).send(err);
                    else if (result.length == 0)
                        res.status(401).json({ Error: "No_Data" });
                    else {
                        const user = Object.values(JSON.parse(JSON.stringify(result)))[0];
                        res.status(200).json(user);
                    }

                    conn.release();
                }
            );
        } else {
            res.json({ mysqlError: err });
        }
    });
});

app.post("/signup", (req, res) => {
    const id = req.body["id"];
    const pwd = req.body["pwd"];
    const phone = req.body["phone"];

    pool.getConnection(function (err, conn) {
        if (!err) {
            conn.query(
                `insert into TEST VALUES(?,?,?)`,
                [id, pwd, phone],
                function (err, result) {
                    try {
                        if (result != null)
                            res.status(201).json({
                                "success": "done"
                            })
                        else if (result == null)
                            res.status(400).json({
                                "success": "fail",
                                "message": "same id exist"
                            })

                    } catch (error) {
                        console.log(error)
                        res.status(400)
                    }
                }

            );
            conn.release();

        }
        else {
            res.status(400).send(err)
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port : ${port}!`));