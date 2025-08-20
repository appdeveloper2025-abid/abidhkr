# ABID HACKER - GitHub Pages Deployment Guide

This guide will help you deploy your ABID HACKER website to GitHub Pages step by step.

## Prerequisites

1. **GitHub Account**: Create a free account at [github.com](https://github.com)
2. **Git Installed**: Download from [git-scm.com](https://git-scm.com)
3. **Web Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)

## Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"New"** button or **"+"** icon
3. Repository name: `usa-hunter-website`
4. Description: `Professional ethical hacking learning platform`
5. Make it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 2: Prepare Local Repository

Open Command Prompt/Terminal in your project folder and run:

```bash
# Navigate to your project folder
cd "C:\Users\Abid Mehmood\Desktop\kali linux\usa-hunter-website"

# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: ABID HACKER ethical hacking learning platform"

# Add remote repository (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/usa-hunter-website.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select **"Deploy from a branch"**
5. Choose **"main"** branch
6. Select **"/ (root)"** folder
7. Click **"Save"**

### Step 4: Access Your Live Website

After 5-10 minutes, your website will be available at:
```
https://yourusername.github.io/usa-hunter-website/
```

## Custom Domain (Optional)

If you have a custom domain:

1. Create a `CNAME` file in your repository root
2. Add your domain name (e.g., `usahunter.com`)
3. Configure DNS settings with your domain provider
4. Point to: `yourusername.github.io`

## File Structure

Your deployed website includes:

```
usa-hunter-website/
├── index.html              # Main landing page
├── css/
│   └── style.css           # Kali Linux inspired styles
├── js/
│   └── script.js           # jQuery functionality
├── pages/
│   ├── courses.html        # Course catalog
│   ├── about.html          # About page
│   ├── contact.html        # Contact information
│   └── networking/
│       └── tcp-ip.html     # Sample course content
├── README.md               # Project documentation
├── _config.yml             # GitHub Pages configuration
├── .gitignore              # Git ignore rules
└── DEPLOYMENT.md           # This file
```

## Updating Your Website

To make changes:

1. Edit files locally
2. Test changes by opening `index.html` in browser
3. Commit and push changes:

```bash
git add .
git commit -m "Update: describe your changes"
git push origin main
```

Changes will appear on your live site within 5-10 minutes.

## Troubleshooting

### Common Issues:

1. **404 Error**: Check file paths and ensure all links are relative
2. **CSS Not Loading**: Verify CSS file paths in HTML files
3. **Images Not Showing**: Ensure image URLs are correct
4. **Site Not Updating**: Wait 10 minutes, clear browser cache

### Support:

- **Creator**: Abid Mehmood
- **Email**: abidbusiness@gmail.com
- **Phone/WhatsApp**: 03029382306

## Features Included

✅ **Responsive Design** - Works on all devices
✅ **Kali Linux Theme** - Dark design with green accents
✅ **100+ Course Structure** - Organized learning paths
✅ **Interactive Elements** - jQuery functionality
✅ **SEO Optimized** - Search engine friendly
✅ **Fast Loading** - Optimized for performance

## Next Steps

1. **Add More Courses**: Create additional course pages
2. **Customize Content**: Update with your specific information
3. **Add Analytics**: Include Google Analytics tracking
4. **Social Media**: Add social media links
5. **Contact Form**: Implement backend for contact form

---

**ABID HACKER** - Master Ethical Hacking Through Structured Learning 🛡️
