# Google Maps API Setup Guide for TsvWeb

## 📍 Step 1: Get Your Google Maps API Key

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Enter project name: `TsvWeb`
5. Click **"Create"**

### 1.2 Enable Required APIs
1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for and enable these APIs:
   - ✅ **Maps JavaScript API** (for displaying maps)
   - ✅ **Places API** (for location search - optional)
   - ✅ **Geocoding API** (for address conversion - optional)

### 1.3 Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. **Copy your API key** (you'll need this!)

### 1.4 Restrict Your API Key (IMPORTANT!)
1. Click on your newly created API key
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Click **"Add an item"**
   - Add these referrers:
     ```
     localhost:3000/*
     *.tsvweb.com/*
     tsvweb.com/*
     ```
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check these APIs:
     - Maps JavaScript API
     - Places API (if you enabled it)
     - Geocoding API (if you enabled it)
4. Click **"Save"**

## 🔧 Step 2: Add API Key to Your Project

### 2.1 Update .env.local
Open `.env.local` and replace `YOUR_API_KEY_HERE` with your actual API key:

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 2.2 Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## 🗺️ Step 3: Use the Google Map Component

### Example 1: Basic Map (Contact Page)
```tsx
import GoogleMap from '@/components/maps/google-map'

export default function ContactPage() {
  return (
    <div>
      <h1>Find Us</h1>
      <GoogleMap
        center={{ lat: 52.4862, lng: -1.8904 }} // Birmingham
        zoom={13}
        height="500px"
        markers={[
          {
            position: { lat: 52.4862, lng: -1.8904 },
            title: "TsvWeb Office",
            info: "Professional Web Design Birmingham"
          }
        ]}
      />
    </div>
  )
}
```

### Example 2: Multiple Locations
```tsx
<GoogleMap
  center={{ lat: 52.4862, lng: -1.8904 }}
  zoom={11}
  height="600px"
  markers={[
    {
      position: { lat: 52.4862, lng: -1.8904 },
      title: "Birmingham Office",
      info: "Main office in city centre"
    },
    {
      position: { lat: 52.4114, lng: -1.7780 },
      title: "Solihull Branch",
      info: "Serving Solihull businesses"
    }
  ]}
/>
```

### Example 3: Service Area Map
```tsx
<GoogleMap
  center={{ lat: 52.4862, lng: -1.8904 }}
  zoom={10}
  height="400px"
  markers={[
    { position: { lat: 52.4862, lng: -1.8904 }, title: "Birmingham" },
    { position: { lat: 52.4114, lng: -1.7780 }, title: "Solihull" },
    { position: { lat: 52.5700, lng: -1.7800 }, title: "Sutton Coldfield" },
    { position: { lat: 52.4547, lng: -1.9317 }, title: "Edgbaston" }
  ]}
/>
```

## 📍 Birmingham Area Coordinates

Use these coordinates for your service areas:

```typescript
const locations = {
  birmingham: { lat: 52.4862, lng: -1.8904 },
  solihull: { lat: 52.4114, lng: -1.7780 },
  suttonColdfield: { lat: 52.5700, lng: -1.7800 },
  edgbaston: { lat: 52.4547, lng: -1.9317 },
  westMidlands: { lat: 52.4862, lng: -1.8904 }
}
```

## 🎨 Component Props

```typescript
interface GoogleMapProps {
  center?: { lat: number; lng: number }  // Default: Birmingham
  zoom?: number                           // Default: 13
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    info?: string                         // Shows in popup on click
  }>
  height?: string                         // Default: '400px'
  className?: string                      // Additional CSS classes
}
```

## 💰 Pricing Information

### Free Tier (Generous!)
- **$200 free credit per month**
- Maps JavaScript API: **28,000 loads/month FREE**
- Most small-medium websites stay within free tier

### What Counts as Usage?
- 1 map load = displaying the map once
- Average website: 1,000-5,000 loads/month
- You're safe with normal traffic!

### Monitor Usage
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"Dashboard"**
3. View your usage statistics

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use `NEXT_PUBLIC_` prefix (required for client-side)
- ✅ Restrict API key to your domains
- ✅ Restrict to only needed APIs
- ✅ Monitor usage regularly
- ✅ Use different keys for dev/production

### ❌ DON'T:
- ❌ Share your API key publicly
- ❌ Commit API keys to GitHub
- ❌ Use unrestricted keys
- ❌ Enable unnecessary APIs

## 🐛 Troubleshooting

### Map Not Showing?
1. Check browser console for errors
2. Verify API key is correct in `.env.local`
3. Ensure you've enabled Maps JavaScript API
4. Check domain restrictions match your URL
5. Restart dev server after changing `.env.local`

### "This page can't load Google Maps correctly"
- Your API key restrictions are too strict
- Add your domain to HTTP referrers
- Check billing is enabled (even for free tier)

### Map Shows but No Markers?
- Check marker coordinates are correct
- Verify zoom level isn't too far out
- Check browser console for JavaScript errors

## 📚 Additional Resources

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

## 🎯 Next Steps

1. Get your API key from Google Cloud Console
2. Add it to `.env.local`
3. Restart your dev server
4. Add `<GoogleMap />` to your contact page
5. Customize with your business locations!

---

**Need Help?** Check the troubleshooting section or contact support.
