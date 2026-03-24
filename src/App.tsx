import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan flex flex-col relative overflow-hidden font-pixel scanlines">
      <div className="static-noise"></div>
      
      <header className="w-full p-6 text-center relative z-10 border-b-4 border-magenta tear">
        <h1 className="text-6xl md:text-8xl font-bold tracking-widest glitch text-cyan" data-text="SYS.SNAKE_OS">
          SYS.SNAKE_OS
        </h1>
        <p className="text-magenta mt-2 tracking-widest text-2xl">v.9.9.9 // CORRUPTED_SECTOR</p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 relative z-10 w-full max-w-7xl mx-auto">
        
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-2 lg:order-1 tear" style={{ animationDelay: '1s' }}>
          <SnakeGame />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-2">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="bg-black border-4 border-cyan p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-magenta animate-pulse"></div>
              <h2 className="text-4xl font-bold text-magenta mb-2 glitch" data-text="AUDIO_STREAM">
                AUDIO_STREAM
              </h2>
              <p className="text-cyan text-2xl mb-6">
                &gt; DECRYPTING_FILES...
              </p>
              <MusicPlayer />
            </div>
            
            <div className="hidden lg:block bg-black border-4 border-magenta p-6 relative tear" style={{ animationDelay: '2.5s' }}>
              <h3 className="text-3xl font-bold text-cyan mb-4">&gt; INPUT_PARAMS</h3>
              <ul className="space-y-3 text-2xl text-magenta">
                <li className="flex justify-between border-b-2 border-cyan border-dashed pb-1">
                  <span>VECTOR_CTRL</span>
                  <span className="text-cyan">WASD/ARROWS</span>
                </li>
                <li className="flex justify-between border-b-2 border-cyan border-dashed pb-1">
                  <span>HALT_EXEC</span>
                  <span className="text-cyan">SPACE</span>
                </li>
                <li className="flex justify-between border-b-2 border-cyan border-dashed pb-1">
                  <span>TARGET</span>
                  <span className="text-cyan">CONSUME_MAGENTA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
