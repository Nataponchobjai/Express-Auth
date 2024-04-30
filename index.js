const express = require('express')

const app = express()

const jwt = require('jsonwebtoken')

const PORT = 5000

const bcrypt = require('bcrypt')

app.use(express.json())

const data = [
    { id: 1, name: "Modestine", password: "Jorin" },
    { id: 2, name: "Darin", password: "De Blase" },
    { id: 3, name: "Gnni", password: "Dael" },
  ];
  


function generateToken (user) {
   return jwt.sign(user, 'Yondor')

}

function authenticateToken (req, res, next) {
    //get meta information from request
    const authHeader = req.headers.authorization
    //store token
    const token = authHeader && authHeader.split(" ")[1]

    //what if no token
    if(!token) return res.sendStatus(401)

    jwt.verify(token, 'Yondor', (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user

        next()
    })
}

app.get('/', (req, res) => {
    res.json({
        message : "Hello welcome to our server"
    })
})

app.get('/people', authenticateToken, (req, res) => {
    res.json(data)
})

app.post('/signup', async (req, res) => {
    const {name, password} = req.body

    const hashedpassword = await bcrypt.hash(password, 10)

    console.log(name, hashedpassword)
    data.push({ id: "5", name, password: hashedpassword})
    res.json(data)
})


app.post('/signin', async (req, res) => { 
    const {name, password} = req.body
    // console.log(name, password)
    
    //find user

    const user = data.find((user) => user.name === name)

    console.log(user)

    const match = await bcrypt.compare(password, user.password)
    
    console.log(match)
    
    if(match){
        const token = generateToken(user)
        res.json(token)
    }else{
        res.sendStatus(403)
    }

    //check and compare the user mathces the names password with the supplied password from the frontend

    //if there is a match then send back token

    //else throw status

    // const token = generateToken(user)
    // res.json(token)
})


app.listen(PORT, ()=> console.log(`Hi listening on port ${PORT}`))

