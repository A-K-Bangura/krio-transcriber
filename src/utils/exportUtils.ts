import { TranscriptSegment, formatTimestamp } from '@/store/transcriptionStore';

export const exportToTxt = (segments: TranscriptSegment[]): void => {
  const content = segments
    .map((seg) => {
      const timestamp = formatTimestamp(seg.timestamp);
      const speaker = seg.speaker ? `[${seg.speaker}] ` : '';
      return `[${timestamp}] ${speaker}${seg.text}`;
    })
    .join('\n\n');

  downloadFile(content, 'transcript.txt', 'text/plain');
};

export const exportToSrt = (segments: TranscriptSegment[]): void => {
  const content = segments
    .map((seg, index) => {
      const startTime = formatSrtTimestamp(seg.timestamp);
      const endTime = formatSrtTimestamp(
        segments[index + 1]?.timestamp || seg.timestamp + 5000
      );
      return `${index + 1}\n${startTime} --> ${endTime}\n${seg.text}\n`;
    })
    .join('\n');

  downloadFile(content, 'transcript.srt', 'text/srt');
};

export const exportToJson = (segments: TranscriptSegment[]): void => {
  const content = JSON.stringify(segments, null, 2);
  downloadFile(content, 'transcript.json', 'application/json');
};

const formatSrtTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const millis = ms % 1000;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis
    .toString()
    .padStart(3, '0')}`;
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
