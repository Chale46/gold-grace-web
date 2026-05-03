# Vercel Redirect Configuration

## **Purpose**
Redirect all `*.vercel.app` URLs to the custom domain `jadtraconsulting.com` to ensure consistent branding and SEO.

---

## **Option 1: Configure via Vercel Dashboard**

### **Steps:**

1. **Login to Vercel**
   - Go to `https://vercel.com/dashboard`
   - Login with your account

2. **Navigate to Project Settings**
   - Select project `gold-grace-web`
   - Click on "Settings" tab
   - Click on "Domains" section

3. **Set Primary Domain**
   - Make sure `jadtraconsulting.com` is set as **Primary Domain**
   - The checkbox "Add to default production environment" should be checked

4. **Redirect Configuration**
   - Vercel automatically redirects `*.vercel.app` to your custom domain
   - No additional configuration needed if custom domain is set as primary

5. **Verify Redirect**
   - Visit `https://gold-grace-web.vercel.app`
   - Should automatically redirect to `https://jadtraconsulting.com`

---

## **Option 2: Configure via vercel.json**

Add redirect rules to `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",

  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],

  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "gold-grace-web.vercel.app"
        }
      ],
      "destination": "https://jadtraconsulting.com/:splat",
      "permanent": true
    },
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "jadtraweb.vercel.app"
        }
      ],
      "destination": "https://jadtraconsulting.com/:splat",
      "permanent": true
    }
  ],

  "headers": [
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/plain"
        }
      ]
    },
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/xml"
        }
      ]
    },
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## **Option 3: Configure via Environment Variable**

Set the default domain in Vercel:

1. **Go to Project Settings**
   - Settings > General > Environment Variables

2. **Add Variable**
   - Name: `VERCEL_DEFAULT_DOMAIN`
   - Value: `jadtraconsulting.com`
   - Environment: Production, Preview, Development

---

## **Verification**

### **Test Redirect:**

```bash
# Test with curl
curl -I https://gold-grace-web.vercel.app

# Expected output should include:
# HTTP/2 301 
# location: https://jadtraconsulting.com/
```

### **Test in Browser:**
1. Open `https://gold-grace-web.vercel.app`
2. Should redirect to `https://jadtraconsulting.com`
3. URL in address bar should show `jadtraconsulting.com`

---

## **SEO Benefits**

- **Prevents duplicate content**: All traffic goes to one domain
- **Preserves SEO value**: 301 redirects pass link equity
- **Consistent branding**: All users see your custom domain
- **Better analytics**: All traffic tracked under one domain

---

## **After Configuration**

1. **Deploy changes** to Vercel
2. **Test redirects** from both `gold-grace-web.vercel.app` and `jadtraweb.vercel.app`
3. **Monitor** for any redirect loops or errors
4. **Update** any external links pointing to vercel.app URLs

---

## **Troubleshooting**

### **Redirect Loop:**
- Check that custom domain is set as primary
- Ensure no conflicting redirect rules in vercel.json
- Clear browser cache

### **Redirect Not Working:**
- Verify custom domain DNS is properly configured
- Check Vercel dashboard for domain status
- Ensure SSL certificate is issued

### **Mixed Content Errors:**
- Update all hardcoded URLs in code to use relative paths
- Ensure all resources (images, scripts, styles) use HTTPS

---

## **Summary**

After this configuration:
- ✅ All `*.vercel.app` URLs redirect to `jadtraconsulting.com`
- ✅ SEO is consolidated to one domain
- ✅ Branding is consistent across all traffic
- ✅ Link equity is preserved via 301 redirects
