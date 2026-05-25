# Install MongoDB locally on Windows (for Royal Overseas)

This guide fixes two common issues:
- `mongod is not recognized as the name of a cmdlet`
- `MongoDB service not found`

## 1) Run the automated setup script
From the project root:

```bat
scripts\setup-mongodb-windows.cmd
```

If you prefer PowerShell automation, it may fail due to local PowerShell script parsing issues in this environment.


What the script does:
- Checks whether `mongod` exists
- If missing, downloads the MongoDB Community Server Windows MSI
- Installs MongoDB (silent) and configures it as a Windows service (best effort)
- Adds MongoDB `bin` to your **User** PATH so `mongod` works in terminals
- Tries to start the MongoDB service

## 2) Verify
```powershell
mongod --version
Get-Service *mongo*
net start MongoDB
```

If `mongod --version` still fails, restart your terminal and try again.

## 3) Ensure env vars exist
Make sure `server/.env` exists and contains (at minimum):

```env
MONGO_URI=mongodb://127.0.0.1:27017/royaloverseas
JWT_SECRET=your-very-secure-random-string-here
```

## 4) Start backend
```bash
npm run dev:server
```

Expected:
- `✓ MongoDB Connected`
- `✓ Royal Overseas API running on port 5000`

