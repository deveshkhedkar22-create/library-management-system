const express = require('express');
const {users} = require("../data/users.json")
const {books} = require("../data/books.json");

const router = express.Router();

//////////////////////////////////////////////////////////
/**
 * Route: /books
 * Method: Get
 * Description: Get all the list of books in the system
 * Access: public
 * parameters: none
 */
router.get('/',(req, res)=>{
    res.status(200).json({
        success: true,
        data: books
    })
})


////////////////////////////////////////////////////
/**
 * Route: /books/:id
 * Method: GET
 * Description: Get a book by it's ID
 * Access: public
 * parameters: id
 */
router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const book = books.find((item)=> item.id == id);

    if(!book){
        return res.status(404).json({
            success: false,
            message:`Book ${id} not found`
        })
    }

    res.status(200).json({ 
        success: true,
        data: book 
    })
})

/////////////////////////////////////////////////////
/**
 * Route: /books
 * Method: POST
 * Description: Create/Register new book
 * Access: public
 * parameters: none
 */

/**
 * {
        "id": "14",
        "title": "Pro Git",
        "subtitle": "Everything you neeed to know about Git",
        "author": "Scott Chacon and Ben Straub",
        "published": "2014-11-18T00:00:00.000Z",
        "publisher": "Apress; 2nd edition",
        "pages": 458,
        "description": "Pro Git (Second Edition) is your fully-updated guide to Git and its usage in the modern world. Git has come a long way since it was first developed by Linus Torvalds for Linux kernel development. It has taken the open source world by storm since its inception in 2005, and this book teaches you how to use it like a pro.",
        "website": "https://git-scm.com/book/en/v2"
    },
 */
router.post('/', (req, res)=>{
    const {id, title, subtitle, author, published, publisher, pages, description, website} =req.body;

    //check if all the required fields are present.
    if(!id || !title || !subtitle || !author || !published || !publisher || !pages || !description || !website){
        return res.status(400).json({
            success:false,
            message:"Please enter all required fields."
        })
    }
     //check if the book already exists.
    const book = books.find((each)=>each.id == id)
    if(book){
        return res.status(409).json({
            success: false,
            message:`Oh ho! Book with id: ${id} already existed.`
        })
    }

    //If all checks pass, Create a new book and push it to the books array.
    books.push({id, title, subtitle, author, published, publisher, pages, description, website})
    res.status(201).json({
        success: true,
        message: "Congrats! New book has been created"

    })
})

/////////////////////////////////////////////////////////
/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating a book by it's ID 
 * Access: public
 * parameters: ID
 */
router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    //check if the book exists
    const book = books.find((each)=>each.id == id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`Book not found for id: ${id}`
        })
    }

    // Object.assign(book, data);
    //using spread operator
    const updatedBook =  books.map((each)=>{
        if(each.id == id){
            return{
                ...each,
                ...data
            }
        }
        return each
    })
    res.status(200).json({
        success:true,
        data: updatedBook,
        message:"Book updated successfully!"
    })
})
/////////////////////////////////////////////
/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Deleting a book by it's ID      
 * access: public
 * parameters: ID
 */
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    //check if the book exists
    const book = books.find((each)=>each.id == id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`Book not found for id: ${id}`
        })
    }
    //filter out the book to be deleted
    const updatedBooks = books.filter((each)=>each.id != id)
    res.status(200).json({
        success:true,
        data: updatedBooks,
        message:"Book deleted successfully!"
    })
})

//////////////////////////////////////////////
/**
 * Route: /books/issued/for-users
 * Method: GET
 * Description: Get all the list of issued books in the system
 * Access: public
 * parameters: none
*/
router.get('/issued/for-users',(req, res)=>{
    const issuedBooks = users.flatMap((user) =>
        (user.issuedBooks || []).flatMap((issuedBook) => {
            const book = books.find((book) => book.id == issuedBook.bookId);

            if (!book) {
                return [];
            }

            return [{
                ...book,
                issuedBy: `${user.firstName} ${user.lastName}`,
                issuedDate: issuedBook.issueDate,
                returnDate: issuedBook.returnDate
            }];
        })
    );

    if(issuedBooks.length === 0){
        return res.status(404).json({
            success: false,
            message:`No issued books found`
        })
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
})

   
// this is the books router for library management system.
module.exports = router;