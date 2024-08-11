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
  }

  const endClick = () => {
    setEndClicked(!endClicked);
    if(startClicked === true){
      setStartClicked(false);
    }
  }



  const render = () => {
    const tileSize = 600/mazeSize;

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
            display = `bg-green-400`;
            break;
          case 13:
            display = `bg-red-400`;
            break;
          case 1:
            display = `bg-purple-300`;
            break;
          case 2:
            display = `bg-green-300`;
            break;
          case 3:
            display = `bg-green-500`;
            break;
          default:
            display = ``;
            break;
        }

        tiles.push( <div className={`${display} w-[${tileSize}px] h-[${tileSize}px] border-[1px] border-slate-500 cursor-pointer`} onClick={() => {clickedTile(rowIndex, index)}}></div> )

      })
    })
    console.log(tiles);


    return (
      <div className={`grid grid-cols-${mazeSize} grid-rows-${mazeSize} bg-slate-700 max-w-[600px] max-h-[600px] mx-auto`}>
        {tiles}
      </div>
    )
  }


  useEffect(() => {
    console.log('Refreshed...');
    setRenderMaze(render());
  }, [clicked, start, end])



  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col justify-center">
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
      <div className='rounded-full bg-[#6bdfff] px-6 py-2 mx-auto font-semibold cursor-pointer mt-10'>Solve maze</div>

    </div>
  );
}

export default App;
