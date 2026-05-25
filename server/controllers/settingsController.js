import Settings from '../models/Settings.js';

function uploadedImageUrl(file) {
  return file?.path || file?.secure_url || file?.url;
}

export async function getSettings(req, res) {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
}

export async function updateSettings(req, res) {
  const logo = req.file ? uploadedImageUrl(req.file) : undefined;
  const payload = {
    companyName: req.body.companyName,
    email: req.body.email,
    whatsapp: req.body.whatsapp,
    address: req.body.address,
    socialLinks: {
      facebook: req.body['socialLinks[facebook]'] || req.body.facebook || '',
      instagram: req.body['socialLinks[instagram]'] || req.body.instagram || '',
      linkedin: req.body['socialLinks[linkedin]'] || req.body.linkedin || '',
    },
    ...(logo && { logo }),
  };
  const settings = await Settings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(settings);
}
