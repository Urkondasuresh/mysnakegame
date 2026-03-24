import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ' && gameOver) { resetGame(); return; }
      if (e.key === ' ' && !gameOver) { setIsPaused(p => !p); return; }
      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (currentDir.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (currentDir.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (currentDir.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (currentDir.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => { directionRef.current = direction; }, [direction]);

  useEffect(() => {
    if (isPaused || gameOver) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          handleGameOver(); return prevSnake;
        }
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver(); return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10); generateFood(newSnake);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food]);

  const handleGameOver = () => {
    setGameOver(true); setIsPaused(true);
    if (score > highScore) setHighScore(score);
  };

  const generateFood = (currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE); setDirection(INITIAL_DIRECTION); setScore(0);
    setGameOver(false); setIsPaused(false); generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00ffff40';
    ctx.lineWidth = 2;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }

    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center font-pixel w-full max-w-md">
      <div className="w-full flex justify-between items-center mb-4 border-b-4 border-cyan pb-2">
        <div className="flex flex-col">
          <span className="text-magenta text-3xl">SEQ_SCORE</span>
          <span className="text-6xl text-cyan glitch" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-magenta text-3xl">MAX_SEQ</span>
          <span className="text-6xl text-cyan">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative border-4 border-magenta p-2 bg-black w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block w-full h-full bg-black"
        />
        
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center border-4 border-cyan m-2">
            {gameOver ? (
              <>
                <h2 className="text-6xl text-magenta mb-2 glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-cyan text-3xl mb-8">SEQ_TERMINATED: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-4 bg-magenta text-black text-4xl hover:bg-cyan transition-none"
                >
                  [ REBOOT ]
                </button>
              </>
            ) : (
              <>
                <h2 className="text-6xl text-cyan mb-8 glitch" data-text={snake.length > 1 ? 'SYS_HALT' : 'AWAIT_CMD'}>
                  {snake.length > 1 ? 'SYS_HALT' : 'AWAIT_CMD'}
                </h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-5 bg-cyan text-black text-4xl hover:bg-magenta transition-none"
                >
                  [ EXECUTE ]
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
