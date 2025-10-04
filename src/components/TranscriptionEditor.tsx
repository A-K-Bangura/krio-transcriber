import { useEffect, useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { toast } from 'sonner';

export const TranscriptionEditor = () => {
  const { currentText, setCurrentText, addSegment, insertTimestamp } =
    useTranscriptionStore();
  const [speaker, setSpeaker] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        insertTimestamp();
        toast.success('Timestamp inserted');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertTimestamp]);

  const handleAddSegment = () => {
    if (currentText.trim()) {
      addSegment(currentText.trim(), speaker || undefined);
      setSpeaker('');
      toast.success('Segment added');
    }
  };

  return (
    <div className="p-4 bg-card rounded-2xl shadow-md border border-border">
      <h3 className="text-lg font-semibold mb-4">Transcription Editor</h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">
              Speaker (optional)
            </label>
            <Input
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="Speaker 1"
              className="w-full"
            />
          </div>
          <Button
            onClick={insertTimestamp}
            variant="outline"
            size="sm"
            className="mt-6"
            title="Insert timestamp (Ctrl+M)"
          >
            <Clock className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">
            Transcript Text
          </label>
          <Textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Type or paste transcription here..."
            className="min-h-[200px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Press Ctrl+M to insert timestamp
          </p>
        </div>

        <Button onClick={handleAddSegment} className="w-full" disabled={!currentText.trim()}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Transcript
        </Button>
      </div>
    </div>
  );
};
