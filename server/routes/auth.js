import express from "express";
import passport from "passport";

const router = express.Router();

// @desc    Authenticate request with Google
// @route   GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/map");
  }
);

// @desc    Authenticate request with Facebook
// @route   GET /auth/facebook
router.get("/facebook", passport.authenticate("facebook"));

// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    console.log(req.body);
  }
);

router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.send(null);
  }
});

// @desc    Logout user
// @route   GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  // res.redirect("http://localhost:3000");
  res.send("200");
});

export default router;
