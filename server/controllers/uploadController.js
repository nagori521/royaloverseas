export function uploadImage(req, res) {
  res.status(201).json({
    path: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
}
