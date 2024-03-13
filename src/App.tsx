import './App.css';
import { HMSRoom } from './HMSRoom';

const useSearchParams = (param: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
};

function App() {
  const roomCodes = useSearchParams('roomCodes');

  if (!roomCodes) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Please provide &nbsp;<b>comma(,)</b>&nbsp;separated roomCodes in search e.g. ?roomCode=code1,code2
      </div>
    );
  }
  const codes = roomCodes.split(',');
  const cols = Math.ceil(Math.sqrt(codes.length));
  const rows = Math.ceil(codes.length / cols);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        placeItems: 'center',
        height: '100%',
        gap: 8,
      }}
    >
      {codes.map((roomCode, index) => (
        <HMSRoom key={roomCode} roomCode={roomCode} userId={`user-${index}`} />
      ))}
    </div>
  );
}

export default App;
