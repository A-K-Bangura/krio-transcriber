import { Navbar } from "@/components/Navbar";
import { MicRecorder } from "@/components/MicRecorder";
import { AudioUploader } from "@/components/AudioUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TranscriptionEditor } from "@/components/TranscriptionEditor";
import { TranscriptFeed } from "@/components/TranscriptFeed";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex gap-6 p-6 w-full max-w-[1800px] mx-auto">
        {/* Left Panel - Audio Controls & Editor */}
        <div className="w-[45%] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MicRecorder />
            <AudioUploader />
          </div>

          <AudioPlayer />

          <TranscriptionEditor />
        </div>

        {/* Right Panel - Transcript Feed */}
        <div className="w-[55%] bg-card rounded-2xl shadow-md border border-border overflow-hidden">
          <TranscriptFeed />
        </div>
      </main>
    </div>
  );
};

export default Index;
