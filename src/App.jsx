import { useEffect, useState } from 'react';



function App() {

  const [mazeSize, setMazeSize] = useState(5);
  const [maze, setMaze] = useState([[]]); 
  const [renderMaze, setRenderMaze] = useState('');
  const [solved, setSolved] = useState(false);
  const [clicked, setClicked] = useState(0);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [endClicked, setEndClicked] = useState(false);

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const sizeChange = (e) => {
    setMazeSize(e.target.value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let array = [];
    for( let i = 0; i < mazeSize; i++ ) {
      array[i] = [];
      for( let j = 0; j < mazeSize; j++ ) {
        console.log(i, j)
        array[i][j] = 10;
      }
    }

    setMaze(array);
    setClicked(clicked+1)
  }


  const clickedTile = (rowIndex, index) => {

    let array = maze;
    if(startClicked) {
      array[rowIndex][index] = 12;
      if(start) {
        array[start[0]][start[1]] = 10;
      }
      if(rowIndex === end[0] && index === end[1]) {
        setEnd(false);
      }
      setStart([rowIndex, index]);
      
    } else if(endClicked) {
      array[rowIndex][index] = 13;
      if(end) {
        console.log('end: ',end)
        array[end[0]][end[1]] = 10;
      }
      if(rowIndex === start[0] && index === start[1]) {
        setStart(false);
      }
      setEnd([rowIndex, index]);
      
    } else {
      array[rowIndex][index] = (maze[rowIndex][index] !== 11) ? 11 : 10;
    }

    setMaze(array);
    setClicked(clicked+1);
  }

  const startClick = () => {
    setStartClicked(!startClicked);
    if(endClicked === true){
      setEndClicked(false);
    }

    setClicked(clicked+1);
  }

  const endClick = () => {
    setEndClicked(!endClicked);
    if(startClicked === true){
      setStartClicked(false);
    }

    setClicked(clicked+1);
  }

  const bfs = async () => {
    if (!start || !end) {
      return;
    }
  
    const directions = [
      [0, 1],  // right
      [1, 0],  // down
      [0, -1], // left
      [-1, 0], // up
    ];
  
    let queue = [[...start]];
    let visited = new Set();
    let parentMap = new Map();
    let tempMap = maze;
  
    visited.add(`${start[0]}-${start[1]}`);
  
    while (queue.length > 0) {
      
      let [x, y] = queue.shift();
  
      // If the end is reached, backtrack to find the path
      if (x === end[0] && y === end[1]) {
        let path = [];
        let current = `${end[0]}-${end[1]}`;
        
        while (current) {
          path.push(current);
          current = parentMap.get(current);
        }
        
        path.reverse().forEach((tile, idx) => {
          let [row, col] = tile.split('-').map(Number);
          if (idx !== 0 && idx !== path.length - 1) {
            tempMap[row][col] = 3; // Mark the shortest path
          }
        });
        tempMap[end[0]][end[1]] = 13;
        
  
        setMaze([...tempMap]);
        setSolved(true);
        return;
      }
  
      // Explore neighbors
      directions.forEach(([dx, dy]) => {
        let newX = x + dx;
        let newY = y + dy;
        let newKey = `${newX}-${newY}`;
  
        if (
          newX >= 0 && newY >= 0 &&
          newX < mazeSize && newY < mazeSize &&
          !visited.has(newKey) && tempMap[newX][newY] !== 11 // not a wall
        ) {
          queue.push([newX, newY]);
          visited.add(newKey);
          tempMap[newX][newY] = 1; // Mark as visited
          parentMap.set(newKey, `${x}-${y}`);
        }
      });
      
      setMaze([...tempMap]);
      setClicked(clicked+1); 
    }
  };



  const render = () => {
    const tileSize = 500/mazeSize;

    let tiles = [];
    maze.map((tileArray, index) => {
      const rowIndex = index;
      if(tileArray.length === 0){
        return (
          <></>
        )
      }

      tileArray.map((tile, index) =>{
        let display;
        switch (tile) {
          case 10:
            display = `bg-slate-50`;
            break;
          case 11:
            display = `bg-slate-800`;
            break;
          case 12:
            display = `bg-green-500`;
            break;
          case 13:
            display = `bg-red-500`;
            break;
          case 1:
            display = `bg-purple-300`;
            break;
          case 2:
            display = `bg-green-300`;
            break;
          case 3:
            display = `bg-green-200`;
            break;
          default:
            display = ``;
            break;
        }

        tiles.push( <div className={`${display} w-[${tileSize}px] h-[${tileSize}px] border-[1px] border-slate-500 cursor-pointer`} onClick={() => {clickedTile(rowIndex, index)}}></div> )

      })
    })
    console.log(tiles);

    console.log(mazeSize)
    return (
      <div className="grid bg-slate-700 w-[600px] h-[600px] mx-auto" style={{gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${mazeSize}, minmax(0, 1fr))`, }}>
        {tiles}
      </div>
    )
  }


  useEffect(() => {
    console.log('Refreshed...')
    console.log('maze: ', maze)
    setRenderMaze(render());
  }, [clicked])



  return (
    <div className="w-screen bg-slate-50 flex flex-col justify-center p-20">
      <div className='flex justify-between w-[700px] mx-auto gap-4'>
        <form id="numberForm"  className="px-8 py-6 bg-green-300 max-w-[400px] rounded-3xl mx-auto" onSubmit={(e) => e.preventDefault()} >
          <div className="flex gap-4 items-center pb-4">
            <label className="text-xl font-semibold">Size of the maze:</label>
            <input type="number" id="numberInput" name="numberInput" value={mazeSize} onChange={(e) => {sizeChange(e)}}  required min="5" max="50" className="rounded-full outline-none px-6 py-2" />
          </div>
          <div className="flex justify-center">
            <button type="submit"  className="rounded-full bg-[#6bdfff] px-6 py-2 mx-auto font-semibold cursor-pointer" onClick={handleSubmit}>Submit</button>
          </div>
        </form>

        <div className='text-lg font-semibold bg-green-300 max-w-[300px] max-h-[145px] rounded-3xl px-8 py-4 text-center flex flex-col justify-center'>
          Welcome to maze game, click tiles and see what the shortest path is!
        </div>
      </div>

    <div className='flex justify-center gap-10 mb-10'>
      <div className={`${startClicked ? 'bg-[#6b93ff]' : 'bg-[#6bdfff]'} rounded-full px-6 py-2 font-semibold cursor-pointer mt-6 transition-all duration-500`} onClick={startClick}>Set start</div>
      <div className={`${endClicked ? 'bg-[#6b93ff]' : 'bg-[#6bdfff]'} rounded-full px-6 py-2 font-semibold cursor-pointer mt-6 transition-all duration-500`} onClick={endClick}>Set end</div>
    </div>

      {renderMaze}
      <div className='rounded-full bg-[#6bdfff] px-6 py-2 mx-auto font-semibold cursor-pointer mt-10' onClick={bfs}>Solve maze</div>

    </div>
  );
}

export default App;
