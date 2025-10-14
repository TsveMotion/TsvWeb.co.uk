# TsvWeb Scripts

Utility scripts for managing and testing TsvWeb features.

## IndexNow Scripts

### Generate IndexNow Key

Generates a random hexadecimal key for IndexNow integration.

```bash
npm run indexnow:generate-key
```

**Output:**
- Displays the generated key
- Saves key to `indexnow-key.txt` (temporary file)
- Provides instructions for adding to `.env.local`

### Test IndexNow Integration

Tests your IndexNow setup to ensure everything is configured correctly.

```bash
npm run indexnow:test
```

**Tests:**
1. ✅ Environment configuration (INDEXNOW_KEY, SITE_URL)
2. ✅ Key file accessibility at `https://tsvweb.com/{key}.txt`
3. ✅ API endpoint at `/api/indexnow`
4. ✅ URL submission functionality

**Prerequisites:**
- Application must be running (`npm run dev` or `npm start`)
- Environment variables must be set in `.env.local`

## Usage Examples

### First-time Setup

```bash
# 1. Generate a key
npm run indexnow:generate-key

# 2. Copy the key and add to .env.local
# INDEXNOW_KEY=your_generated_key_here

# 3. Start your application
npm run dev

# 4. Test the integration
npm run indexnow:test
```

### Troubleshooting

If tests fail:

1. **Environment not configured**
   - Ensure `.env.local` exists with `INDEXNOW_KEY` and `SITE_URL`

2. **Key file not accessible**
   - Restart your application
   - Check that `public/{key}.txt` exists
   - Verify web server is serving static files

3. **API endpoint not working**
   - Check application is running
   - Verify no errors in console logs

4. **URL submission fails**
   - Check internet connection
   - Verify IndexNow API is accessible
   - Review rate limiting (429 errors)

## Adding New Scripts

To add a new script:

1. Create the script file in this directory
2. Add to `package.json` scripts section:
   ```json
   "script-name": "node scripts/your-script.js"
   ```
3. Document it in this README

## Notes

- Scripts use Node.js built-in modules (no additional dependencies)
- All scripts are safe to run (read-only or create temporary files)
- Scripts are designed to be run from the project root directory
