// runs multiple handlers sequentially, just like Express
module.exports = [
  (req, res, next) => {
    req.ok = 'OK';
    next();
  },

  (req, res) => {
    res.send(req.ok + " " + req.method);
  }
];
