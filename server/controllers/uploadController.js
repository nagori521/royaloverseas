export function uploadImage(req, res) {
  const path = req.file?.path || req.file?.secure_url || req.file?.url;

  res.status(201).json({
    path,
    filename: req.file?.filename || req.file?.originalname || req.file?.public_id,
  });
}
