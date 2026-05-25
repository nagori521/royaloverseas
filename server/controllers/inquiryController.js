import Inquiry from '../models/Inquiry.js';

export async function createInquiry(req, res) {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json(inquiry);
}

export async function getInquiries(req, res) {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
}

export async function updateInquiryStatus(req, res) {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json(inquiry);
}

export async function deleteInquiry(req, res) {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json({ message: 'Inquiry deleted' });
}
