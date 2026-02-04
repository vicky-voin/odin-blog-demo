exports.processLogout = (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthenticated, cannot log out" });
  } else {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({ status: "Logged out successfully" });
    });
  }
};
