# Royal Overseas

Full-stack Royal Overseas import export website.

## Frontend

```bash
npm install
npm run dev
```

## Backend

### MongoDB (fixes: `mongod is not recognized` / MongoDB service not found — Windows)

See also: `INSTALL_MONGODB_WINDOWS.md`.

1) Run the automated installer/configure script from the project root:

```bat
scripts\setup-mongodb-windows.cmd
```


2) Ensure you have `server/.env` and it includes at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/royaloverseas
JWT_SECRET=your-very-secure-random-string-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Product, gallery, and settings image uploads are stored in Cloudinary under the
`royaloverseas` folder. Uploaded image URLs are saved directly in MongoDB, so
deployments do not depend on a local `uploads/` directory.

3) Verify MongoDB (optional but recommended):

```powershell
mongod --version
Get-Service *mongo*
net start MongoDB
```

### Start the backend

```bash
npm run server
```


API base URL:

```txt
http://127.0.0.1:5000/api
```

Admin login defaults:

```txt
admin@royaloverseas.com
admin123
```

## Build

```bash
npm run build
```
