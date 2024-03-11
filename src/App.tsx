import "./App.css";
import { HMSRoom } from "./HMSRoom";


const useSearchParams = (param: string) => {
  const  searchParams  = new URLSearchParams(window.location.search);

  return searchParams.get(param);
}

function App() {
  const roomCodes = useSearchParams('roomCodes');

  if(!roomCodes) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
       Please provide &nbsp;<b>comma(,)</b>&nbsp;separated roomCodes in search e.g. ?roomCode=code1,code2
    </div>
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        placeItems: "center",
        height: "100%",
      }}
    >
      {roomCodes?.split(',').map((roomCode, index) => <HMSRoom roomCode={roomCode} userId={`user-${index}`} />)}
    </div>
  );
}

export default App;
