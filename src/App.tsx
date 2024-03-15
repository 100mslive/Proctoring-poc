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
        display: 'flex',
        flexFlow: 'row wrap',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      {codes.map((roomCode, index) => (
        <div
          style={{
            width: `calc(${Math.floor(100 / cols)}% - ${8 * cols - 1}px`,
            height: `calc(${Math.floor(100 / rows)}% - ${8 * rows - 1}px`,
          }}
        >
          <HMSRoom key={roomCode} roomCode={roomCode} userId={`user-${index}`} hideControls={codes.length > 1} />
        </div>
      ))}
    </div>
  );
}

export default App;
