// add dependencies
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan")
const mysql = require("mysql");
const path = require("path");
const jwt = require("jsonwebtoken")

// add config
const setup = require('./config/db_connect');
const { encode } = require("punycode");
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
    
    const id = req.body["id"]; // 학번   
    const pwd = req.body["pwd"];
    

    pool.getConnection(function (err, conn) {
        if (!err) {
            conn.query(
                `select * from student where id = ? and pwd = ?`,
                [id, pwd],
                function (err, result) {
                    if (err) res.status(400).send(err);
                    else if (result.length == 0)
                        res.status(401).json({ Error: "No_Data" });
                    else {
                        const user = Object.values(JSON.parse(JSON.stringify(result)))[0];
                        const token = jwt.sign({ id: id },
                            "secret-key",
                            {
                                algorithm: "HS256",
                                expiresIn: "1h",
                            }
                        )
                        res.status(200).json({
                            user: user,
                            "token": token
                        });

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
    //이름 전공 학번(id) 전화번호 주소 주민번호 비밀번호
    const name = req.body["name"];
    const major = req.body["major"];
    const id = req.body["id"];
    const phone =req.body["phone"];
    const address = req.body["address"];
    const secretnum = req.body["secretnum"];
    const pwd = req.body["pwd"];
    
    pool.getConnection(function (err, conn) {
        if (!err) {
            conn.query(
                `insert into student VALUES(?,?,?,?,?,?,?)`,
                [name, major, id,phone,address,secretnum,pwd],
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

app.post("/test", (req, res) => {
    const JWT = req.headers.jwt
    console.log(JWT)
    try {
        jwt.verify(JWT, "secret-key")
        res.send({ ok: true })
    } catch {
        res.send({ ok: false })
    }
})

app.post("/check", (req, res) => {

    const nodenum = req.body["nodenum"];
    pool.getConnection(function (err, conn) {
        if (!err) {
            conn.query(
                `select * from node where nodenum = ? `,
                //select 유니크아이디, 자기해쉬 from 테이블 where 자기해쉬 = (select 윗놈해쉬 from 테이블 where  유니크아이디 + 1) 
                [nodenum],
                function (err, result) {
                    if (err) res.status(400).send(err);
                    else if (result.length == 0)
                        res.status(401).json({ Error: "No_Data" });
                    else {
                        const user = Object.values(JSON.parse(JSON.stringify(result)))[0];
                        
                        res.status(200).json({
                            
                        });

                    }

                    conn.release();
                }
            );
        } else {
            res.json({ mysqlError: err });
        }
    });


})
app.listen(port, () => console.log(`Example app listening on port : ${port}!`));