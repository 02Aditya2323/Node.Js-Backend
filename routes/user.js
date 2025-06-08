const express=require("express");
const {handleGetAllUsers,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleCreateNewUser}=require("../controllers/user.js");
// REST API and crud operations
const router=express.Router();   // sice we r creating an unique route for handling all the routes in our website; we create it like this i.e. instead of app we create router
///now we only used /user route; means ("/"" => /user) , ("/:id" => /user/:id)

router.get("/",handleGetAllUsers) ///means any request coming here will simply use this function form our controllers

router.get("/:id",handleGetUserById);  //fetching all users based on their id 


router.post("/",handleCreateNewUser);


router.patch("/:id",handleUpdateUserById)


router.delete("/:id",handleDeleteUserById)

module.exports=router;