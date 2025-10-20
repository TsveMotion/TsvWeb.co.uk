# ⚡ QUICK START - 3 Steps to Success

## ✅ What's Done

- ✅ **ONE plugin** - TsvWeb (includes monitoring + optimizer)
- ✅ **OpenAI key** - Sent from TsvWeb server automatically
- ✅ **REST API** - Full remote control
- ✅ **Dashboard sync** - Enable/disable from Next.js

---

## 🚀 3 STEPS TO SUCCESS

### STEP 1: Package Plugin (30 seconds)

```bash
node scripts/create-plugin-zip.js
```

### STEP 2: Upload to WordPress (2 minutes)

1. Go to: https://swisstimedeals.com/wp-admin
2. Plugins → Delete old TsvWeb plugins
3. Add New → Upload Plugin → Select `tsvweb.zip`
4. Activate

### STEP 3: Enable from Dashboard (10 seconds)

1. Go to: http://localhost:3000/admin/wordpress-sites
2. Click site → Manage
3. Click **"Enable"** button
4. ✅ **DONE!**

---

## 🎯 What Happens When You Click "Enable"

```
1. Dashboard → Next.js API
2. Next.js API → MongoDB (update status)
3. Next.js API → WordPress (send OpenAI key)
4. Next.js API → WordPress (toggle optimizer)
5. WordPress → Stores key & enables optimizer
6. Dashboard → Shows "✓ Enabled"
```

**FULLY AUTOMATED!** 🎉

---

## ✅ Verify It Works

### Test 1: Check Dashboard
- Status shows: **"✓ Enabled"**

### Test 2: Check WordPress
- Go to: WooCommerce → Product Optimizer
- Shows: **"Optimizer Enabled"**

### Test 3: Optimize Product
- Edit any product
- Click: "Optimize with AI"
- ✅ **Works!**

---

## 🔗 REST API Endpoints

All use: `X-API-Key: your-tsvweb-api-key`

- `GET /wp-json/tsvweb/v1/optimizer/status`
- `POST /wp-json/tsvweb/v1/optimizer/toggle`
- `GET /wp-json/tsvweb/v1/optimizer/stats`

---

## 🎉 You Get

✅ **ONE plugin** (not 3!)  
✅ **Automatic OpenAI key** (no wp-config.php!)  
✅ **Dashboard control** (enable/disable remotely)  
✅ **Full sync** (Dashboard ↔ WordPress)  
✅ **Product optimizer** (AI-powered)  
✅ **SEO features** (titles, descriptions, keywords)  

**EVERYTHING IN ONE PLACE!** 🚀

---

**Read full guide:** `FINAL_SETUP_GUIDE.md`
