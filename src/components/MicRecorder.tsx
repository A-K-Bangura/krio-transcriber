import { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { toast } from 'sonner';

export const MicRecorder = () => {
  const { isRecording, setIsRecording } = useTranscriptionStore();
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Set up audio visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Animate audio levels
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const animate = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animate();

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to access microphone');
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      setIsRecording(false);
      setAudioLevel(0);
      toast.success('Recording stopped');
    }
  };

  return (
    <div className="p-4 bg-card rounded-2xl shadow-md border border-border">
      <h3 className="text-lg font-semibold mb-4">Microphone</h3>
      
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          size="lg"
          variant={isRecording ? 'destructive' : 'default'}
          className="w-full"
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {isRecording && (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground">Recording...</span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-100"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
