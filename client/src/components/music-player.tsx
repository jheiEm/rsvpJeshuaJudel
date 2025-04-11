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
  isYoutubeLink?: boolean;
}

interface MusicPlayerProps {
  musicUrl?: string;
}

// Global YouTube API variable
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const [isYoutubeTrack, setIsYoutubeTrack] = useState(false);
  const [youtubeApiLoaded, setYoutubeApiLoaded] = useState(false);
  
  // Fetch the active music track from the server
  const { data: activeTrack, isLoading, error } = useQuery<MusicTrack>({
    queryKey: ['/api/music/active'],
    retry: 1, // Only retry once if no active track is found
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  // Determine which music URL to use and if it's a YouTube link
  const trackUrl = activeTrack?.filePath || musicUrl || DEFAULT_MUSIC_URL;
  const trackInfo = activeTrack ? `${activeTrack.title}${activeTrack.artist ? ` - ${activeTrack.artist}` : ''}` : 'Wedding Music';
  
  // Load YouTube API on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !youtubeApiLoaded) {
      // Load YouTube iframe API
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Set up callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        setYoutubeApiLoaded(true);
      };
    }
  }, [youtubeApiLoaded]);
  
  // Set YouTube flag based on active track
  useEffect(() => {
    if (activeTrack) {
      const isYoutube = !!activeTrack.isYoutubeLink;
      setIsYoutubeTrack(isYoutube);
      console.log('Track is YouTube link:', isYoutube, 'URL:', activeTrack.filePath);
    } else {
      setIsYoutubeTrack(false);
    }
  }, [activeTrack]);

  // Helper to extract YouTube video ID from URL
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Initialize audio element on mount or when track changes
  useEffect(() => {
    setIsMounted(true);
    
    // Skip audio initialization if this is a YouTube track
    if (isYoutubeTrack) {
      // Clean up audio if it exists
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current = null;
      }
      return;
    }
    
    // Clean up YouTube player if it exists
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying YouTube player:', e);
      }
      youtubePlayerRef.current = null;
    }
    
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
  }, [trackUrl, isYoutubeTrack]);

  // Update progress for the player UI
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle play/pause state for audio tracks
  useEffect(() => {
    // Skip this effect if we're using a YouTube track
    if (isYoutubeTrack || !audioRef.current) return;
    
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
  }, [isPlaying, isYoutubeTrack]);

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
    if (isYoutubeTrack) {
      // YouTube restart logic would go here when fully implemented
      // Would use the YouTube iframe API to seek to the beginning
      console.log('Restarting YouTube track');
      
      if (!isPlaying) {
        setIsPlaying(true);
      }
      return;
    }
    
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

  // Initialize YouTube player when required
  useEffect(() => {
    if (!isYoutubeTrack || !youtubeApiLoaded || !activeTrack) {
      return;
    }
    
    const youtubeId = extractYoutubeId(trackUrl);
    if (!youtubeId) {
      console.error("Could not extract YouTube ID from URL:", trackUrl);
      return;
    }
    
    console.log("Creating YouTube player with video ID:", youtubeId);
    
    // Create hidden container for YouTube iframe if it doesn't exist
    if (!document.getElementById('youtube-player-container')) {
      const container = document.createElement('div');
      container.id = 'youtube-player-container';
      container.style.position = 'absolute';
      container.style.bottom = '0';
      container.style.right = '0'; 
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.visibility = 'hidden';
      document.body.appendChild(container);
    }
    
    // Create YouTube player
    if (typeof window.YT !== 'undefined' && window.YT.Player) {
      // Destroy previous player if exists
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying previous YouTube player:', e);
        }
      }
      
      youtubePlayerRef.current = new window.YT.Player('youtube-player-container', {
        videoId: youtubeId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            if (isPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
            event.target.setVolume(30); // 0-100
            
            // Set duration for UI if available
            if (event.target.getDuration && event.target.getDuration() > 0) {
              setDuration(event.target.getDuration());
            }
          },
          onStateChange: (event: any) => {
            console.log('YouTube player state changed:', event.data);
            
            // State 1 is playing, 2 is paused
            if (event.data === 1 && !isPlaying) {
              setIsPlaying(true);
            } else if (event.data === 2 && isPlaying) {
              setIsPlaying(false);
            }
            
            // Update currentTime for progress bar
            if (event.data === 1) { // Playing
              const updateYoutubeProgress = () => {
                if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
                  setCurrentTime(youtubePlayerRef.current.getCurrentTime());
                }
              };
              
              // Update every second
              const intervalId = setInterval(updateYoutubeProgress, 1000);
              return () => clearInterval(intervalId);
            }
          }
        }
      });
    } else {
      console.error("YouTube API not loaded yet");
    }
    
    return () => {
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        } catch (e) {
          console.error('Error cleaning up YouTube player:', e);
        }
      }
    };
  }, [isYoutubeTrack, youtubeApiLoaded, trackUrl, activeTrack]);
  
  // Control YouTube player based on isPlaying state
  useEffect(() => {
    if (!isYoutubeTrack || !youtubePlayerRef.current) return;
    
    try {
      if (isPlaying) {
        youtubePlayerRef.current.playVideo();
      } else {
        youtubePlayerRef.current.pauseVideo();
      }
    } catch (e) {
      console.error('Error controlling YouTube player:', e);
    }
  }, [isPlaying, isYoutubeTrack]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Hidden container for YouTube iframe API */}
      <div 
        id="youtube-player-container" 
        ref={youtubeContainerRef} 
        style={{ position: 'absolute', visibility: 'hidden', width: '1px', height: '1px' }}
      />
      
      {/* Player controls expand on hover */}
      <div className="relative group">
        <div className="absolute bottom-full right-0 mb-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[280px] border-2 border-[#8a1538]">
          <div className="flex flex-col gap-3">
            {/* Track info */}
            <div className="text-sm font-medium text-[#6b0f2b] truncate max-w-[250px] text-center">
              {isYoutubeTrack ? `${trackInfo} (YouTube)` : trackInfo}
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
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
                className="text-[#6b0f2b] hover:text-[#6b0f2b]/80 transition-colors p-2"
                title="Restart"
                disabled={isYoutubeTrack && !youtubePlayerRef.current}
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={toggleMusic}
                className="bg-[#6b0f2b] text-white rounded-full p-3 hover:bg-[#6b0f2b]/90 transition-colors shadow-md"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-[2px]" />}
              </button>
              
              <button
                onClick={() => {
                  if (!isYoutubeTrack && audioRef.current) {
                    audioRef.current.volume = audioRef.current.volume > 0.5 ? 0.3 : 0.7;
                  } else if (isYoutubeTrack && youtubePlayerRef.current) {
                    const currentVolume = youtubePlayerRef.current.getVolume();
                    youtubePlayerRef.current.setVolume(currentVolume > 50 ? 30 : 70);
                  }
                }}
                className="text-[#6b0f2b] hover:text-[#6b0f2b]/80 transition-colors p-2"
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
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#6b0f2b] text-white shadow-lg hover:bg-[#6b0f2b]/90 transition-all duration-300 border-2 border-white"
          aria-label={isPlaying ? "Mute music" : "Play music"}
          title={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? (
            <Volume2 size={22} />
          ) : (
            <VolumeX size={22} />
          )}
        </button>
      </div>
      
      {/* Music playing indicator */}
      {isPlaying && (
        <div className="absolute -top-8 right-0 whitespace-nowrap text-xs bg-white/95 backdrop-blur-sm text-[#6b0f2b] px-3 py-1 rounded-md shadow-md border border-[#e8c1c8]">
          <Music className="inline-block w-3 h-3 mr-1" />
          <span>{isYoutubeTrack ? "YouTube Music Playing" : "Music Playing"}</span>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;