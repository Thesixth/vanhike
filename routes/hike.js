const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const asyncError = require("../utils/AsyncError");
const Hike = require("../models/hike");
const { isLoggedIn } = require("../utils/isauthenticated");

router.get(
  "/",
  asyncError(async (req, res) => {
    const hikes = await Hike.find({});
    res.render("hikes/index", { hikes });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("hikes/new");
});

router.post(
  "/",
  isLoggedIn,
  asyncError(async (req, res) => {
    if (!req.body.hike)
      throw new ExpressError("Please provide the necessary data", 400);
    const newhike = new Hike(req.body.hike);
    newhike.author = req.user._id;
    await newhike.save();
    req.flash("success", "You have successfully added a new Hike");
    res.redirect(`/hikes/${newhike._id}`);
  })
);

router.get(
  "/:id",
  asyncError(async (req, res) => {
    const singlehike = await Hike.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!singlehike) {
      req.flash("error", "Resource not found");
      return res.redirect("/hikes");
    }
    console.log(singlehike);
    res.render("hikes/show", { singlehike });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  asyncError(async (req, res) => {
    const singlehike = await Hike.findById(req.params.id);
    res.render("hikes/edit", { singlehike });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  asyncError(async (req, res) => {
    const hike = await Hike.findByIdAndUpdate(req.params.id, {
      ...req.body.hike,
    });
    req.flash("success", "You have successfully updated this Hike");
    res.redirect(`/hikes/${hike._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  asyncError(async (req, res) => {
    await Hike.findByIdAndDelete(req.params.id);
    req.flash("success", "You have successfully deleted the hike");
    res.redirect("/hikes");
  })
);

module.exports = router;
