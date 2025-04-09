# Guide to Updating Images on Your Wedding Website

This guide provides step-by-step instructions for updating all images across your wedding website.

## Overview of Images Used

The website uses images in several key sections:
1. Hero background image
2. Our Story section (3 images)
3. Event Details section (2 images)
4. Gallery section (multiple images)
5. Wedding Party/Entourage section

## Setup for Local Images

### Step 1: Create Images Directory

1. Create a folder for your images in the public directory:
```bash
mkdir -p client/public/images
```

2. Create subdirectories to organize your images:
```bash
mkdir -p client/public/images/gallery
mkdir -p client/public/images/venue
mkdir -p client/public/images/story
mkdir -p client/public/images/entourage
```

### Step 2: Add Your Images

1. Copy your images to the appropriate directories
2. It's recommended to optimize your images for web using a tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
3. Use descriptive file names (e.g., `church-exterior.jpg`, `couple-proposal.jpg`)

## Updating Each Section

### 1. Hero Section

Open `client/src/components/hero-section.tsx` and locate the background image:

```tsx
// Find this code
<div 
  className="absolute inset-0 bg-cover bg-center z-0"
  style={{ 
    backgroundImage: "url('https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" 
  }}
></div>

// Replace with
<div 
  className="absolute inset-0 bg-cover bg-center z-0"
  style={{ 
    backgroundImage: "url('/images/hero-background.jpg')" 
  }}
></div>
```

### 2. Our Story Section

Open `client/src/components/our-story.tsx` and update each image:

```tsx
// Find image elements like this
<img 
  src="https://images.unsplash.com/photo-1583157763403-b916257d1f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  alt="Couple holding hands" 
  className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover border-4 border-white" 
/>

// Replace with your images
<img 
  src="/images/story/how-we-met.jpg" 
  alt="Jeshua and Judel when they met" 
  className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover border-4 border-white" 
/>
```

Update all three images in this component.

### 3. Event Details Section

Open `client/src/components/event-details.tsx` and locate the venue images:

```tsx
// Find ceremony image
<img 
  src="https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  alt="Ceremony venue" 
  className="w-full h-48 object-cover rounded-md" 
/>

// Replace with
<img 
  src="/images/venue/church.jpg" 
  alt="St. Therese Church" 
  className="w-full h-48 object-cover rounded-md" 
/>

// Find reception image
<img 
  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  alt="Reception venue" 
  className="w-full h-48 object-cover rounded-md" 
/>

// Replace with
<img 
  src="/images/venue/mountain-rock-resort.jpg" 
  alt="Mountain Rock Resort" 
  className="w-full h-48 object-cover rounded-md" 
/>
```

### 4. Gallery Section

Open `client/src/components/gallery.tsx` and locate the gallery images array:

```tsx
// Find the galleryImages array
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Couple photo 1"
  },
  // More images...
];

// Replace with your images
const galleryImages = [
  {
    src: "/images/gallery/photo1.jpg",
    alt: "Jeshua and Judel at the beach"
  },
  {
    src: "/images/gallery/photo2.jpg",
    alt: "Our engagement day"
  },
  // Add all your gallery images here
];
```

### 5. Entourage Section

Open `client/src/components/entourage.tsx` and update any entourage member photos:

```tsx
// If you have individual photos for entourage members
<img 
  src="https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
  alt="John Smith" 
  className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md" 
/>

// Replace with your photos
<img 
  src="/images/entourage/best-man.jpg" 
  alt="John Smith" 
  className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md" 
/>
```

## Alternative: Using an Image Hosting Service

If you prefer to host your images online:

1. Upload your images to a service like [Cloudinary](https://cloudinary.com/), [Imgur](https://imgur.com/), or [ImgBB](https://imgbb.com/)
2. Get the direct URLs to your images
3. Replace the image URLs in the code as shown above, but use the full URLs from your hosting service

Example:
```tsx
<img 
  src="https://i.imgur.com/abcd1234.jpg" 
  alt="Ceremony venue" 
  className="w-full h-48 object-cover rounded-md" 
/>
```

## Image Size Recommendations

For best performance, optimize your images before adding them to your website:

| Type | Recommended Size | Format |
|------|-----------------|--------|
| Hero Background | 1920 x 1080 pixels | JPEG or WebP |
| Gallery Photos | 800 x 600 pixels | JPEG or WebP |
| Venue Photos | 800 x 600 pixels | JPEG or WebP |
| Story Photos | 800 x 800 pixels | JPEG or WebP |
| Entourage Portraits | 400 x 400 pixels | JPEG or WebP |

## Using Your Wedding Invitation as a Reference

Since you've already designed your wedding invitation with a specific theme and color scheme, consider:

1. Using the same border designs or decorative elements from your invitation
2. Matching the typography styles
3. Using the same color palette (burgundy/maroon watercolor theme)
4. Including any special symbols or motifs that appear on your invitation

## Image Guidelines for a Cohesive Look

1. **Use Consistent Photo Editing**: Apply the same filter or editing style to all photos for a cohesive look
2. **Be Mindful of Color Scheme**: Choose photos that complement your burgundy/maroon theme
3. **Mix Professional and Candid Shots**: Include a balance of posed and natural moments
4. **Consider Image Quality**: Only use high-resolution images that will look good on all devices

By following these guidelines, your wedding website will have a personalized, professional look that matches your invitation and overall wedding theme.