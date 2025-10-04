import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { formatTimestamp } from '@/store/transcriptionStore';

export const AudioPlayer = () => {
  const { audioFile, playbackTime, setPlaybackTime } = useTranscriptionStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioFile && audioRef.current) {
      const url = URL.createObjectURL(audioFile);
      audioRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackTime(audioRef.current.currentTime * 1000);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration * 1000);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0] / 1000;
      setPlaybackTime(value[0]);
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 5
      );
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  if (!audioFile) {
    return (
      <div className="p-4 bg-card rounded-2xl shadow-md border border-border">
        <h3 className="text-lg font-semibold mb-4">Audio Player</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Upload an audio file to start playback
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card rounded-2xl shadow-md border border-border">
      <h3 className="text-lg font-semibold mb-4">Audio Player</h3>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleRewind} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button onClick={togglePlay} size="sm" className="flex-1">
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button onClick={handleForward} variant="outline" size="sm">
            <FastForward className="w-4 h-4" />
          </Button>

          <Button onClick={cycleSpeed} variant="outline" size="sm">
            {playbackSpeed}x
          </Button>
        </div>

        <div className="space-y-2">
          <Slider
            value={[playbackTime]}
            onValueChange={handleSeek}
            max={duration}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTimestamp(playbackTime)}</span>
            <span>{formatTimestamp(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
