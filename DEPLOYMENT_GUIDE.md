# A1 Furniture Studio - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Rahim8828/A1-Furniture_Studio.git
cd A1-Furniture_Studio

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/A1-Furniture_Studio/',
  // ... rest of config
})
```

### Option 4: Traditional Hosting (cPanel, etc.)

1. Run `npm run build`
2. Upload contents of `dist/` folder to your web server
3. Configure server to serve `index.html` for all routes
4. Ensure `.htaccess` or nginx config handles SPA routing

**Apache .htaccess:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🔧 Environment Configuration

Currently, the app uses mock data and doesn't require environment variables.

**For future backend integration:**

Create `.env` file:
```env
VITE_API_URL=https://your-api.com
VITE_WHATSAPP_NUMBER=+919876543210
VITE_ANALYTICS_ID=your-analytics-id
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📊 Performance Optimization

The build is already optimized with:
- ✅ Code splitting by route
- ✅ Lazy loading for images
- ✅ Gzip + Brotli compression
- ✅ Tree shaking
- ✅ Minification
- ✅ Service worker for offline support

**Bundle sizes:**
- Main bundle: ~60 kB (compressed)
- CSS: ~6 kB (compressed)
- Individual routes: 1-5 kB each

## 🔒 Security Headers

The `public/_headers` file includes security headers for Netlify/Vercel:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

For other hosting, configure these in your server settings.

## 🧪 Testing Before Deployment

```bash
# Run all tests
npm test

# Build and preview locally
npm run build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

## 📱 Mobile Testing

Test on actual devices or use browser dev tools:
- Mobile (320px - 480px)
- Tablet (768px - 1024px)
- Desktop (1025px+)

## 🔍 SEO Checklist

- ✅ Meta tags on all pages
- ✅ JSON-LD schema for products
- ✅ SEO-friendly URLs
- ✅ Alt text on images
- ✅ Semantic HTML
- ✅ Sitemap generation
- ✅ robots.txt (add if needed)

## 📈 Analytics Integration

Add Google Analytics or similar:

```typescript
// In main.tsx or App.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR-GA-ID');

// Track page views
useEffect(() => {
  ReactGA.send({ hitType: "pageview", page: location.pathname });
}, [location]);
```

## 🐛 Troubleshooting

**Build fails:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist .vite`

**Routes not working after deployment:**
- Ensure server is configured for SPA routing
- Check base URL in vite.config.ts

**Images not loading:**
- Verify image paths are relative
- Check public folder structure

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/Rahim8828/A1-Furniture_Studio/issues
- Email: [your-email]

## 📄 License

[Add your license here]

---

**Repository:** https://github.com/Rahim8828/A1-Furniture_Studio.git  
**Status:** ✅ Production Ready  
**Last Updated:** February 10, 2026
