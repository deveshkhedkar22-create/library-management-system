const express = require('express');
const {users} = require("../data/users.json")


const router = express.Router();
// const app = express();

//////////////////////////////////////////////////////////
/**
 * Route: /users
 * Method: Get
 * Description: Get all the list of users in the system
 * Access: public
 * parameters: none
 */
router.get('/',(req, res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

////////////////////////////////////////////////////
/**
 * Route: /users/:id
 * Method: GET
 * Description: Get a user by it's ID
 * Access: public
 * parameters: id
 */
router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((item)=> item.id == id);

    if(!user){
        return res.status(404).json({
            success: false,
            message:`User ${id} not found`
        })
    }

    res.status(200).json({ 
        success: true,
        data: user  
    })
})

/////////////////////////////////////////////////////
/**
 * Route: /users
 * Method: POST
 * Description: Create/Register new user
 * Access: public
 * parameters: none
 */
router.post('/', (req, res)=>{
    const {id, firstName, lastName, email, subscriptionType, subscriptionDate} =req.body;

    //check if all the required fields are present.
    if(!id || !firstName || !lastName || !email || !subscriptionDate || !subscriptionType){
        return res.status(400).json({
            success:false,
            message:"Please enter all required fields."
        })
    }
     //check if the user already exists.
    const user = users.find((each)=>each.id == id)
    if(user){
        return res.status(409).json({
            success: false,
            message:`Oh ho! User with id: ${id} already existed.`
        })
    }

    //If all checks pass, Create a new user and pust it to Users array.
    users.push({id, firstName, lastName, email, subscriptionDate, subscriptionType})
    res.status(201).json({
        success: true,
        message: "Congrats! New user has been created"

    })
})
/////////////////////////////////////////////////////////
/**
 * Route: /users
 * Method: PUT
 * Description: Updating a user by it's ID 
 * Access: public
 * parameters: ID
 */
router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    //check if the user exists
    const user = users.find((each)=>each.id == id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:`User not found for id: ${id}`
        })
    }

    // Object.assign(user, data);
    //using spread operator
    const updatedUser =  users.map((each)=>{
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
        data: updatedUser,
        message:"User updated successfully!"
    })
})


/////////////////////////////////////////////////////////
/**
 * Route: /users
 * Method: DELETE
 * Description: Deleting a user by it's ID 
 * Access: public
 * parameters: ID
 */
router.delete('/:id', (req, res)=>{
    const {id}= req.params;

    //check if user exists
    const user = users.find((each)=> each.id == id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        })
    }

    //If user exists, filter it out from the users array
    const updatedUsers = users.filter((each)=> each.id != id)

    //using splice method
    // const index = users.indexOf(user);
    // users.splice(index, 1);

    res.status(200).json({
        success: true,
        data: updatedUsers,
        message: "User Deleted Successfully"

    })
    
})

// this is the user router for library management system. 
module.exports = router;