exports.setupErrorHandling = (app) => {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err });
  });

  app.use((req, res, next) => {
    res.status(404).json({ error: "Cannot find the route" });
  });
};
