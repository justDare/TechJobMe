const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Application Model
const Application = require("../../models/Application");

// @route GET api/applications
// @desc GET All applications
// @access Public
router.get("/", (req, res) => {
  Application.find()
    .sort({ date: -1 })
    .then(applications => res.json(applications));
});

// @route POST api/applications
// @desc Create A Application
// @access Private
router.post("/", auth, (req, res) => {
  const newApplication = new Application({
    name: req.body.name
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
