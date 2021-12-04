export const ensureAuth = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};

export const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/dashboard");
  }
};
