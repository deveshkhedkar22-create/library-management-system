const express = require('express');
const {users} = require("./data/users.json")
const {books} = require("./data/books.json");

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');


const app = express();
const port = 8081;

app.use(express.json());

app.get('/', (req,res)=>{
    res.status(200).json({
        message:"Home Page :-)"
    })
})

app.use('/users', usersRouter);
app.use('/books', booksRouter);


//////////////////////////////////////////////////////////
// app.all('/{*path}', (req,res)=>{
//     res.status(500).json({
//         message:"Not Built yet"
//     })
// })

app.listen(port,()=>{
    console.log(`Server is up and running on http://localhost:${port}`);
    
})