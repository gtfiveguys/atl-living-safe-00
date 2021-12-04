import express from "express";
import Apartment from "../models/Apartment.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

// @desc    Save apartment
// @route   POST /saved
router.post("/", ensureAuth, async (req, res) => {
  try {
    const existed = await Apartment.findOne({
      apt_name: req.body.data.apt_name,
      userId: req.body.data.userId,
    });
    if (!existed) {
      await Apartment.create(req.body.data);
    }
    res.send("200");
  } catch (err) {
    console.error(err, "500");
  }
});

// @desc    Show all saved apartments (from all users)
// @route   GET /saved
router.get("/", ensureAuth, async (req, res) => {
  console.log(req);
  try {
    const savedApartments = await Apartment.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.json(savedApartments);
  } catch (err) {
    console.error(err, "500");
  }
});

// @desc    Delete apartment from saved list
// @route   DELETE /saved/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let apartment = await Apartment.findById(req.params.id).lean();

    if (!apartment) {
      console.log("error 404");
      return;
    }

    if (apartment.userId != req.user.id) {
      console.log("what user?");
    } else {
      await Apartment.deleteOne({ _id: req.params.id });
      return res.send("200");
    }
  } catch (err) {
    console.error(err, "500");
  }
});

// @desc    User's saved apartments
// @route   GET /saved/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const savedApartments = await Apartment.find({
      userId: req.params.userId,
    }).lean();
    // .populate("user")
    res.json(savedApartments);
  } catch (err) {
    console.error(err, "500");
  }
});

export default router;
