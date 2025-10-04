import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTranscriptionStore, formatTimestamp } from '@/store/transcriptionStore';
import type { TranscriptSegment } from '@/store/transcriptionStore';
import { toast } from 'sonner';

interface TranscriptBlockProps {
  segment: TranscriptSegment;
}

export const TranscriptBlock = ({ segment }: TranscriptBlockProps) => {
  const { updateSegment, deleteSegment } = useTranscriptionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(segment.text);
  const [editSpeaker, setEditSpeaker] = useState(segment.speaker || '');

  const handleSave = () => {
    updateSegment(segment.id, {
      text: editText,
      speaker: editSpeaker || undefined,
    });
    setIsEditing(false);
    toast.success('Segment updated');
  };

  const handleCancel = () => {
    setEditText(segment.text);
    setEditSpeaker(segment.speaker || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteSegment(segment.id);
    toast.success('Segment deleted');
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono">{formatTimestamp(segment.timestamp)}</span>
          {segment.speaker && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-md font-medium">
              {segment.speaker}
            </span>
          )}
        </div>

        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm" variant="ghost">
                <Check className="w-4 h-4" />
              </Button>
              <Button onClick={handleCancel} size="sm" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button onClick={handleDelete} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editSpeaker}
            onChange={(e) => setEditSpeaker(e.target.value)}
            placeholder="Speaker (optional)"
            className="text-sm"
          />
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="text-sm min-h-[100px]"
          />
        </div>
      ) : (
        <p className="text-sm leading-relaxed">{segment.text}</p>
      )}
    </div>
  );
};
