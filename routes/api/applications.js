const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Application Model
const Application = require("../../models/Application");

// @route GET api/applications
// @desc GET All applications
// @access Private
router.get("/:id", auth, (req, res) => {
  Application.find({ user_id: req.params.id })
    .sort({ date: -1 })
    .then(applications => res.json(applications));
});

// @route POST api/applications
// @desc Create A Application
// @access Private
router.post("/", auth, (req, res) => {
  // Required fields
  const { name, position } = req.body;

  if (!name || !position) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  const newApplication = new Application({
    name: req.body.name,
    user_id: req.body.user_id,
    position: req.body.position,
    link: req.body.link,
    contact: req.body.contact
  });

  newApplication.save().then(application => res.json(application));
});

// @route DELETE api/applications
// @desc Delete A Application
// @access Private
router.delete("/:id", auth, (req, res) => {
  Application.findById(req.params.id)
    .then(application =>
      application.remove().then(() => res.json({ success: true }))
    )
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
