import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX, Volume2, Play, Pause, SkipBack } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Default music in case no active track is found
const DEFAULT_MUSIC_URL = '/music/wedding-music.mp3';

// Define MusicTrack interface to match the server response
interface MusicTrack {
  id: number;
  title: string;
  artist: string | null;
  filePath: string;
  isActive: boolean;
  uploadedAt: string;
}

interface MusicPlayerProps {
  musicUrl?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Fetch the active music track from the server
  const { data: activeTrack, isLoading, error } = useQuery<MusicTrack>({
    queryKey: ['/api/music/active'],
    retry: 1, // Only retry once if no active track is found
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  // Determine which music URL to use
  const trackUrl = activeTrack?.filePath || musicUrl || DEFAULT_MUSIC_URL;
  const trackInfo = activeTrack ? `${activeTrack.title}${activeTrack.artist ? ` - ${activeTrack.artist}` : ''}` : 'Wedding Music';

  // Initialize audio element on mount or when track changes
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      // Create a new audio element with the track URL
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(trackUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      // Set up event listeners for time updates
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      // If it was previously playing, start the new track
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log('Autoplay was prevented:', error);
          setIsPlaying(false);
        });
      }
      
      // Clean up on unmount or when track changes
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [trackUrl]);

  // Update progress for the player UI
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

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

  // Toggle music play/pause
  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Restart the track from the beginning
  const restartTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      
      // Also make sure it's playing
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Player controls expand on hover */}
      <div className="relative group">
        <div className="absolute bottom-full right-0 mb-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-3 min-w-[250px]">
          <div className="flex flex-col gap-2">
            {/* Track info */}
            <div className="text-sm font-medium text-[#6b0f2b] truncate max-w-[220px]">
              {trackInfo}
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#6b0f2b] h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Time display */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center mt-1">
              <button
                onClick={restartTrack}
                className="text-[#6b0f2b] hover:text-[#6b0f2b]/80 transition-colors"
                title="Restart"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={toggleMusic}
                className="bg-[#6b0f2b] text-white rounded-full p-2 hover:bg-[#6b0f2b]/90 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.volume = audioRef.current.volume > 0.5 ? 0.3 : 0.7;
                  }
                }}
                className="text-[#6b0f2b] hover:text-[#6b0f2b]/80 transition-colors"
                title="Volume"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating button */}
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
      </div>
      
      {/* Music playing indicator */}
      {isPlaying && (
        <div className="absolute -top-8 right-0 whitespace-nowrap text-xs bg-white/90 dark:bg-gray-800/90 text-[#6b0f2b] px-2 py-1 rounded-md shadow-sm">
          <Music className="inline-block w-3 h-3 mr-1" />
          <span>Music Playing</span>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;