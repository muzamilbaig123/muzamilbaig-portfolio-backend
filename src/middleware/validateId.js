function validateId(req, res, next) {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) === 0) {
    return res
      .status(400)
      .json({ message: "Invalid id. It must be a positive integer" });
  }

  req.id = Number(id);
  next();
}

module.exports = validateId;
