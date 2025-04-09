import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX, Volume2 } from 'lucide-react';

// Default wedding music
// Replace this URL with your actual music file
const DEFAULT_MUSIC_URL = '/music/wedding-music.mp3';

interface MusicPlayerProps {
  musicUrl?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl = DEFAULT_MUSIC_URL }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element on mount
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      // Clean up on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [musicUrl]);

  // Handle play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      // Handle autoplay policy
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay was prevented:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Save music preference in localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('wedding-music-enabled', JSON.stringify(isPlaying));
    }
  }, [isPlaying, isMounted]);

  // Load music preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('wedding-music-enabled');
      if (savedPreference !== null) {
        setIsPlaying(JSON.parse(savedPreference));
      }
    }
  }, []);

  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleMusic}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#6b0f2b] text-white shadow-lg hover:bg-[#6b0f2b]/90 transition-all duration-300"
        aria-label={isPlaying ? "Mute music" : "Play music"}
        title={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 size={20} />
        ) : (
          <VolumeX size={20} />
        )}
      </button>
      
      {isPlaying && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white/90 dark:bg-gray-800/90 text-[#6b0f2b] px-2 py-1 rounded-md shadow-sm">
          <Music className="inline-block w-3 h-3 mr-1" />
          <span>Music Playing</span>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;