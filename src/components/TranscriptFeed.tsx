import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { TranscriptBlock } from './TranscriptBlock';

export const TranscriptFeed = () => {
  const { segments } = useTranscriptionStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Transcript Feed</h2>
        <p className="text-sm text-muted-foreground">
          {segments.length} {segments.length === 1 ? 'segment' : 'segments'}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {segments.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No transcript segments yet</p>
              <p className="text-sm text-muted-foreground">
                Add segments from the editor to see them here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {segments.map((segment) => (
              <TranscriptBlock key={segment.id} segment={segment} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
