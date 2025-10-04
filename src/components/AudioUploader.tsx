import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { toast } from 'sonner';

export const AudioUploader = () => {
  const { audioFile, setAudioFile } = useTranscriptionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        toast.success('Audio file loaded');
      } else {
        toast.error('Please upload an audio file');
      }
    }
  };

  const handleRemove = () => {
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 bg-card rounded-2xl shadow-md border border-border">
      <h3 className="text-lg font-semibold mb-4">Audio File</h3>

      {audioFile ? (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{audioFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload">
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <div>
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio File
              </div>
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Supports WAV, MP3, OGG
          </p>
        </div>
      )}
    </div>
  );
};
