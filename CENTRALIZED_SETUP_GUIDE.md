# Centralized Management - Quick Setup Guide

## 🚀 Quick Start

Your centralized WordPress management system is ready! Here's how to use it:

---

## 📍 Access the Dashboard

**URL**: `https://tsvweb.co.uk/admin/wordpress-sites`

**Requirements**:
- Must be logged in as admin
- Access via TsvWeb admin panel

---

## 🎯 Main Features

### 1. AI Optimizer Cost Dashboard

**Location**: Top of the page, purple gradient section

**What You See**:
- Total optimizations across all sites
- Total tokens consumed
- Estimated cost in USD
- "Show Details" button for breakdown

**Actions**:
- Click "Show Details" to see per-site costs
- Click "Hide Details" to collapse

### 2. Per-Site Controls

**Location**: Each WordPress site card

**What You See**:
- AI Optimizer status badge (purple = enabled, gray = disabled)
- Usage stats (optimizations, tokens, cost)
- Enable/Disable button

**Actions**:
- Click "Enable" to allow AI optimization
- Click "Disable" to block AI optimization
- Changes apply immediately

---

## 💡 Common Tasks

### Enable AI Optimizer for a Site

1. Find the site card
2. Look for "AI Optimizer: Disabled" (gray badge)
3. Click purple "Enable" button
4. Success message appears
5. Badge turns purple "Enabled"

### Disable AI Optimizer for a Site

1. Find the site card
2. Look for "AI Optimizer: Enabled" (purple badge)
3. Click red "Disable" button
4. Success message appears
5. Badge turns gray "Disabled"

### Monitor Total AI Costs

1. Look at purple gradient section at top
2. See "Estimated Cost" value
3. Click "Show Details" for breakdown
4. View cost per site

### Check Site-Specific Usage

1. Find the site card
2. Look at AI Optimizer section
3. See: "X optimizations • Y tokens • $Z"
4. This shows usage for that specific site

---

## 🎨 Visual Guide

### Dashboard Layout

```
┌────────────────────────────────────────────────┐
│ WordPress Sites Monitor                        │
│ [Generate API Key] [Download Plugin]           │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Total Sites | Healthy | Posts | Users          │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🤖 AI Product Optimizer    [Show Details ▼]    │
│ Total: 1,234 | Tokens: 45K | Cost: $2.06      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Site 1                                          │
│ 🤖 AI Optimizer: Enabled        [Disable]      │
│    500 optimizations • 27K tokens • $1.23      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Site 2                                          │
│ 🤖 AI Optimizer: Disabled       [Enable]       │
└────────────────────────────────────────────────┘
```

### Color Meanings

- 🟣 **Purple Badge**: Optimizer is enabled
- ⚫ **Gray Badge**: Optimizer is disabled
- 🟣 **Purple Button**: Click to enable
- 🔴 **Red Button**: Click to disable
- 🟢 **Green Badge**: Site assigned to customer
- 🔵 **Blue Badge**: Payment status

---

## 📊 Understanding the Stats

### Aggregate Stats (Top Section)

**Total Optimizations**:
- Sum of all product optimizations across all sites
- Example: 1,234 products optimized

**Tokens Used**:
- Total OpenAI API tokens consumed
- Example: 45,678 tokens

**Estimated Cost**:
- Total cost in USD based on GPT-4 pricing
- Formula: (tokens / 1000) × $0.045
- Example: $2.06

### Per-Site Stats (In Site Cards)

**Format**: `X optimizations • Y tokens • $Z`

**Example**: `500 optimizations • 27,000 tokens • $1.23`

**Meaning**:
- This site has optimized 500 products
- Used 27,000 OpenAI tokens
- Cost approximately $1.23

---

## 🔒 Security & Permissions

### Who Can Access?

✅ **TsvWeb Admins**: Full access to all controls
❌ **Regular Users**: Cannot access this page
❌ **Site Owners**: Cannot control their own optimizer

### What Happens When You Disable?

**Immediately**:
- Optimizer menu hidden in WordPress admin
- "Optimize with AI" buttons disappear
- Bulk optimization disabled

**Preserved**:
- Previously optimized products unchanged
- Usage statistics retained
- Site continues to function normally

**When Re-enabled**:
- All features restore instantly
- No data loss

---

## 💰 Cost Management Tips

### Monitor Regularly

- Check dashboard weekly
- Review per-site costs
- Identify high-usage sites

### Control Costs

1. **Disable High-Usage Sites**:
   - Click "Disable" on expensive sites
   - Prevents further AI usage

2. **Enable Selectively**:
   - Only enable for paying clients
   - Enable temporarily for specific projects

3. **Set Expectations**:
   - Inform clients of costs
   - Include in service agreements

### Typical Costs

| Usage Level | Products/Month | Est. Cost/Month |
|-------------|----------------|-----------------|
| Light       | 50             | $1.69           |
| Medium      | 200            | $6.75           |
| Heavy       | 500            | $16.88          |
| Very Heavy  | 1,000          | $33.75          |

---

## 🔄 How It Works

### Data Sync

1. **WordPress Plugin** collects stats every 30 seconds
2. **Sends to TsvWeb API** automatically
3. **Dashboard Updates** in real-time
4. **You See** current data

### Control Flow

1. **You Click** Enable/Disable button
2. **API Updates** database immediately
3. **WordPress Plugin** checks status
4. **Features** show/hide automatically

### No Manual Steps Required

✅ Automatic synchronization
✅ Instant updates
✅ No configuration needed

---

## 🛠️ Troubleshooting

### Stats Not Showing

**Problem**: AI optimizer stats show 0 or blank

**Solutions**:
1. Ensure WordPress plugin is active
2. Check site has WooCommerce installed
3. Verify optimizer was used at least once
4. Wait 30 seconds for next sync

### Enable/Disable Not Working

**Problem**: Button doesn't change status

**Solutions**:
1. Check you're logged in as admin
2. Refresh the page
3. Check browser console for errors
4. Verify API endpoint is accessible

### Cost Seems Wrong

**Problem**: Estimated cost doesn't match expectations

**Explanation**:
- Cost is estimated based on average GPT-4 pricing
- Actual costs may vary slightly
- Formula: (tokens / 1000) × $0.045
- This is an approximation

---

## 📱 Mobile Access

### Responsive Design

✅ Works on tablets
✅ Works on phones
✅ Touch-friendly buttons
✅ Readable on small screens

### Mobile Tips

- Scroll horizontally for site cards
- Tap "Show Details" to expand
- Swipe to see more sites
- Use landscape for better view

---

## 🎯 Best Practices

### For Cost Control

1. **Start Disabled**: Enable only when needed
2. **Monitor Weekly**: Check costs regularly
3. **Disable Inactive**: Turn off for unused sites
4. **Communicate**: Inform clients of usage

### For Client Management

1. **Enable on Request**: Wait for client approval
2. **Track Usage**: Monitor per-client costs
3. **Bill Accordingly**: Include AI costs in invoices
4. **Set Limits**: Disable if overused

### For Efficiency

1. **Bulk Review**: Check all sites at once
2. **Quick Toggle**: Enable/disable as needed
3. **Use Breakdown**: Identify problem sites
4. **Regular Audits**: Monthly cost reviews

---

## 📞 Support

### Need Help?

**Issues with Dashboard**:
- Check browser console
- Clear cache and refresh
- Try different browser

**Issues with WordPress Plugin**:
- Verify plugin is active
- Check API key is configured
- Review WordPress error logs

**Questions**:
- Contact TsvWeb support
- Reference this guide
- Check main documentation

---

## ✅ Quick Checklist

Before using the dashboard:

- [ ] Logged in as admin
- [ ] WordPress plugin installed on sites
- [ ] API keys configured
- [ ] Sites syncing (check "Last Updated")
- [ ] WooCommerce active (for AI features)

To enable AI optimizer:

- [ ] Find site card
- [ ] Check WooCommerce is installed
- [ ] Click "Enable" button
- [ ] Verify badge turns purple
- [ ] Inform site owner

To monitor costs:

- [ ] Check aggregate stats at top
- [ ] Click "Show Details"
- [ ] Review per-site breakdown
- [ ] Identify high-usage sites
- [ ] Disable if needed

---

## 🎉 You're Ready!

Your centralized management system is fully operational. You can now:

✅ Monitor all WordPress sites from one dashboard
✅ Control AI optimizer per site
✅ Track costs in real-time
✅ Manage everything centrally

**Dashboard URL**: `https://tsvweb.co.uk/admin/wordpress-sites`

**Happy Managing! 🚀**
