# Wedding Website Deployment & Customization Guide

This guide will help you deploy the wedding website on your local computer or another platform, and explain how to customize the content and images.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deploying on Your Local Computer](#deploying-on-your-local-computer)
3. [Customizing Content](#customizing-content)
4. [Updating Images](#updating-images)
5. [Updating Map Locations](#updating-map-locations)
6. [Deploying to Production](#deploying-to-production)

## Prerequisites

Before starting, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or later)
- [Git](https://git-scm.com/)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

## Deploying on Your Local Computer

### Step 1: Clone the repository

1. Open a terminal or command prompt
2. Navigate to the directory where you want to store the project
3. Clone the repository using git:
   ```bash
   git clone [your-repository-url]
   ```
   Or download the project files directly as a ZIP from the Replit project.

### Step 2: Install dependencies

1. Navigate to the project directory:
   ```bash
   cd wedding-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Step 3: Run the development server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to [http://localhost:5000](http://localhost:5000)

3. You should now see the wedding website running locally!

## Customizing Content

The website content is organized in separate component files, making it easy to update.

### Main Component Files

Here's where you can find and update different sections of the website:

| Section | File Path |
|---------|-----------|
| Hero Section | `client/src/components/hero-section.tsx` |
| Countdown Timer | `client/src/components/countdown-timer.tsx` |
| Our Story | `client/src/components/our-story.tsx` |
| Event Details | `client/src/components/event-details.tsx` |
| Wedding Party | `client/src/components/entourage.tsx` |
| Schedule | `client/src/components/schedule.tsx` |
| Gallery | `client/src/components/gallery.tsx` |
| RSVP Form | `client/src/components/rsvp-form.tsx` |
| Contact Info | `client/src/components/contact.tsx` |

### How to Edit Content

1. Open the relevant file in your code editor
2. Locate the text or content you want to change
3. Make your changes and save the file
4. The development server will automatically reload with your changes

### Example: Changing Names and Dates

1. Open `client/src/components/hero-section.tsx`
2. Find the names in the JSX code and update them
3. Open `client/src/components/countdown-timer.tsx`
4. Find the wedding date in the `weddingDate` variable and update it

## Updating Images

### Option 1: Replace Image URLs

The website currently uses placeholder images from Unsplash. You can replace these with your own images:

1. Upload your images to an image hosting service like [Cloudinary](https://cloudinary.com/) or [Imgur](https://imgur.com/)
2. Get the direct URL to your image
3. In the component files, replace the image URLs with your own

Example in `client/src/components/gallery.tsx`:
```tsx
const galleryImages = [
  {
    src: "https://your-image-host.com/your-image-1.jpg", // Replace with your image URL
    alt: "Couple at sunset"
  },
  // other images...
];
```

### Option 2: Add Local Images

To use local images in your project:

1. Create an `images` folder in the `client/public` directory
2. Add your images to this folder
3. Reference them with a path like `/images/your-image.jpg`

Example:
```tsx
<img 
  src="/images/your-image.jpg" 
  alt="Description" 
  className="w-full h-48 object-cover rounded-md" 
/>
```

## Updating Map Locations

To update the map with correct location coordinates:

1. Open `client/src/components/event-details.tsx`
2. Find the coordinate variables:
   ```tsx
   const ceremonyCoords = [13.9427, 121.1630]; // St. Therese Church
   const receptionCoords = [13.9380, 121.1600]; // Mountain Rock Resort
   ```
3. Replace with your actual coordinates
4. Also update the popup content and Google Maps links with your venue details

### How to Get Coordinates

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your venue
3. Right-click on the exact location
4. Select "What's here?"
5. The coordinates will show in the info card at the bottom (e.g., "13.9427, 121.1630")

## Deploying to Production

### Option 1: Deploy on Netlify

1. Create a [Netlify](https://www.netlify.com/) account
2. From your Netlify dashboard, click "New site from Git"
3. Connect to your Git repository
4. Set the build command to: `npm run build`
5. Set the publish directory to: `dist`
6. Click "Deploy site"

### Option 2: Deploy on Vercel

1. Create a [Vercel](https://vercel.com/) account
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Run in your project directory:
   ```bash
   vercel
   ```
4. Follow the prompts to complete deployment

### Option 3: Deploy on GitHub Pages

1. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add these scripts to your package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Add homepage to package.json:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

## Admin Dashboard Access

To access the admin dashboard to view RSVP submissions:

1. Navigate to `/admin/login` on your website
2. Login with:
   - Username: `admin`
   - Password: `wedding2025`

## Need Help?

If you encounter any issues or need additional help customizing your wedding website, please feel free to reach out for support.

---

Happy wedding planning! 💍 👰 🤵