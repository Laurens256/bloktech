const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

// render chat
router.get("/messages", (req, res) => {
    console.log("jajaja");
    res.render("chat", {
      groepsnaam: req.query.room.charAt(0).toUpperCase() + req.query.room.slice(1)
    });
});

router.post("/messages", (req, res) => {
    console.log(req.body);
    res.redirect("/messages?username=" + req.body.username+"&room="+req.body.room);
});

module.exports = router;