import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_CORRUPTION.WAV", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEMORY_LEAK.MP3", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_SIGNAL.FLAC", artist: "NULL", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("ERR:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("ERR:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const skipBack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="w-full font-pixel">
      <audio ref={audioRef} src={currentTrack.url} onEnded={skipForward} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      <div className="border-4 border-magenta p-4 mb-4 bg-black relative overflow-hidden">
        {isPlaying && <div className="absolute inset-0 bg-cyan opacity-20 animate-pulse pointer-events-none"></div>}
        <h3 className="text-3xl text-cyan glitch" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-magenta text-2xl mt-1">SRC: {currentTrack.artist}</p>
        <div className="mt-4 text-cyan text-xl border-t-2 border-cyan border-dashed pt-2">
          STATUS: {isPlaying ? 'TRANSMITTING...' : 'IDLE'}
        </div>
      </div>

      <div className="flex justify-between items-center border-4 border-cyan p-2 mb-4">
        <button onClick={skipBack} className="px-4 py-2 text-2xl bg-black text-magenta border-2 border-magenta hover:bg-magenta hover:text-black transition-none">
          [PREV]
        </button>
        <button onClick={togglePlay} className="px-6 py-2 text-3xl bg-cyan text-black font-bold hover:bg-magenta hover:text-black transition-none glitch" data-text={isPlaying ? 'HALT' : 'EXEC'}>
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={skipForward} className="px-4 py-2 text-2xl bg-black text-magenta border-2 border-magenta hover:bg-magenta hover:text-black transition-none">
          [NEXT]
        </button>
      </div>

      <div className="flex items-center gap-4 border-4 border-magenta p-3">
        <span className="text-cyan text-2xl">VOL:</span>
        <input
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full appearance-none bg-black border-2 border-cyan h-6"
        />
        <span className="text-magenta text-2xl w-16 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
