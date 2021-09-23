const e = require('express')
const express = require('express')
const app = express()
const port = 3000

user_list = [
    {
        id:123,
        pw:123,
        name:"aa"
    },
    {
        id:456,
        pw:456,
        name:"bbc"
    }
]



app.get("/user", (req,res) => {
    id = req.query.id
    pwd = req.query.pwd

    function isuser(el1) {
        if (el1.id == id && el1.pw == pwd) {
            return true
        }
    }

    const user = user_list.find(isuser)
    if (user == null) {
        res.status(400).json({"error":"Not User"})
    }
    else
        res.status(200).json({user})

})

app.get('/', (req, res) =>  {
    res.send("ASDASD")
    }
)


app.listen(port, () => console.log("Example app listening on port port!"))