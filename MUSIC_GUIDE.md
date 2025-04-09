# Music Player Guide

This document explains how to add background music to the wedding website.

## Adding Your Music

1. **Prepare your music file**:
   - Choose a romantic, instrumental music file that represents your relationship
   - Format: MP3 is recommended
   - Size: Keep it under 5MB for faster loading
   - Duration: 3-5 minutes is ideal (the music will loop)

2. **Upload your music file**:
   - Place your music file in the `client/public/music/` directory
   - Rename your file to `wedding-music.mp3`

3. **Customizing the player (optional)**:
   - Open `client/src/components/music-player.tsx`
   - You can modify:
     - The player appearance by changing the CSS classes
     - The default volume (currently set to 0.3 or 30%)
     - The player position (currently bottom-right corner)

## How It Works

- The music player appears as a floating button in the bottom-right corner of the page
- Users can click the button to toggle music on/off
- The player remembers user preferences using browser localStorage
- Music is muted by default until the user chooses to play it (browser autoplay policies)

## User Experience

- When a user visits the site, music is off by default
- If they turn music on, their preference is saved for future visits
- The music will loop continuously until stopped
- A small tooltip appears when music is playing

## Troubleshooting

1. **Music doesn't play**:
   - Verify the music file exists at `client/public/music/wedding-music.mp3`
   - Check browser console for errors
   - Some browsers block audio until user interaction has occurred

2. **Music player doesn't appear**:
   - Verify MusicPlayer component is included in the Home component
   - Check for React errors in the console

3. **Volume issues**:
   - Adjust the default volume in `music-player.tsx` by changing `audioRef.current.volume = 0.3;` (0.0 to 1.0)