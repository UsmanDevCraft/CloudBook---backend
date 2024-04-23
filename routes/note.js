const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
// const { body, validationResult } = require('express-validator');


//ROUTE:1 GET METHOD FOR GETTING USER NOTES
router.get('/fetchallnotes', fetchuser , async (req, res)=>{
    try {
        
        const note = await Notes.find({user: req.user.id});
        res.json(note)

    } catch (error) {
        res.status(500).send({error: "Invalid Credentials, please try again"})
    }
});




//ROUTE:2 POST METHOD FOR ADDING A NOTE
router.post('/addnote', fetchuser ,[
    // body('title', 'Enter a valid title').isLength({min: 3}),
    // body('description', 'Description must be atleast 5 letters').isLength({min: 5}),
] , async (req, res)=>{

    //Return bad request on error
    // const errors = validationResult(req);
    const errors = null;
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // };

    try {

        const {title, description, tag} = req.body;
        
        const note = new Notes({
            title, description, tag, user:req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote)

    } catch (error){
        console.log(error.message);
        res.status(500).send("An Error Occurred");
      }
});




//ROUTE:3 UPDATE AN EXISTING NOTE USING PUT
router.put('/updatenote/:id', fetchuser, async (req, res)=>{

    const {title, description, tag} = req.body;

    try {

        let newNote = {};
        if(title){
            newNote.title = title
        }
        if(description){
            newNote.description = description
        }
        if(tag){
            newNote.tag = tag
        }

        //check if note exists for id
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Note Not Found");
        }

        //check if user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        //Update the note
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note})

    } catch (error){
        res.status(500).send("An Error Occurred")
    }

});




//ROUTE:4 DELETE METHOD FOR DELETING A NOTE 
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{

    try {

        //check whether note exists or note
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Note not found")
        };

        //chech whether user owns the note or note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Cannot delete node, First Autherize please")
        };

        //Deleting the note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note deleted successfully", note : note })

    } catch(error){
        res.status(500).send("An Error Occurred")
    }

});

module.exports = router;