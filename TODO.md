# TODO (Gallery Cloudinary Migration)

- [x] Inspect existing gallery controller/routes/UI code to find local `/uploads` usage
- [x] Verify product module uses Cloudinary storage via `server/config/cloudinary.js` and `server/middleware/uploadMiddleware.js`
- [x] Update gallery create/update to store `cloudinary secure_url` (not local paths)
- [x] Ensure existing gallery CRUD keeps working with the updated image URLs
- [x] Update any frontend rendering logic that assumes `/uploads/...` for gallery images
- [x] Remove dependency on local gallery uploads paths in gallery rendering
- [x] Build verification: `npm run build` passes

