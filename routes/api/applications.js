const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Application Model
const Application = require("../../models/Application");

// @route GET api/applications/id
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
  const { name, position, stage } = req.body;

  if (!name || !position || !stage) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  const newApplication = new Application({
    name: req.body.name,
    user_id: req.body.user_id,
    position: req.body.position,
    link: req.body.link,
    contact: req.body.contact,
    stage: req.body.stage,
    date: req.body.date
  });

  newApplication.save().then(application => res.json(application));
});

// @route DELETE api/applications/id
// @desc Delete A Application
// @access Private
router.delete("/:id", auth, (req, res) => {
  Application.findById(req.params.id)
    .then(application =>
      application.remove().then(() => res.json({ success: true }))
    )
    .catch(err => res.status(404).json({ success: false }));
});

// @route POST api/applications/edit
// @desc Edit A Application
// @access Private
router.post("/edit", auth, (req, res) => {
  const { _id, field } = req.body;

  // Get field name and value from request
  const data = { [field[0]]: field[1] };

  // Find by _id and update single value, return update
  Application.findOneAndUpdate(
    { _id: _id },
    data,
    {
      new: true
    },
    (err, doc) => {
      res.json(doc);
    }
  );
});

module.exports = router;
