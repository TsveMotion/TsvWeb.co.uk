# Install Google APIs Package

## Required Package

You need to install the `googleapis` package to enable Google Drive backup functionality.

## Installation Command

```powershell
npm install googleapis
```

Or with yarn:
```powershell
yarn add googleapis
```

## What This Enables

- ✅ Upload backups to Google Drive
- ✅ List backups from Google Drive
- ✅ Download backups from Google Drive
- ✅ Delete backups from Google Drive
- ✅ Automatic folder creation ("TsvWeb Backups")

## After Installation

1. Run the install command above
2. Restart your dev server (`npm run dev`)
3. The backup system will now save to Google Drive!

## Google Drive Scopes

The current OAuth setup already includes the necessary scopes for Drive access. No additional configuration needed!
