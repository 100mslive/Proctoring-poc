import { useState } from 'react';
import './App.css';
import { HMSRoom } from './HMSRoom';
import { HoverControl } from './HoverControl';

const useSearchParams = (param: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
};

function App() {
  const roomCodes = useSearchParams('roomCodes');
  const [inFocusRoom, setInFocusRoom] = useState('');
  const [showHoverControls, setShowHoverControls] = useState('');

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
        padding: 24,
      }}
    >
      {inFocusRoom ? (
        <>
          <div style={{ flex: '1 1 0', height: '100%', minWidth: 0 }}>
            <HMSRoom key={inFocusRoom} roomCode={inFocusRoom} hideControls={codes.length > 1} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              gap: 8,
              flex: '0 0 240px',
            }}
          >
            {codes
              .filter(roomCode => roomCode !== inFocusRoom)
              .map(roomCode => (
                <div
                  key={roomCode}
                  style={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}
                  onMouseEnter={() => setShowHoverControls(roomCode)}
                  onMouseLeave={() => setShowHoverControls('')}
                >
                  <HMSRoom roomCode={roomCode} hideControls={codes.length > 1} />
                  {showHoverControls === roomCode && <HoverControl onFocusRoom={() => setInFocusRoom(roomCode)} />}
                </div>
              ))}
          </div>
        </>
      ) : (
        codes.map(roomCode => (
          <div
            key={roomCode}
            style={{
              width: `calc(${Math.floor(100 / cols)}% - ${8 * (cols - 1)}px`,
              height: `calc(${Math.floor(100 / rows)}% - ${(8 * (rows - 1)) / 2}px`,
              position: 'relative',
            }}
            onMouseEnter={() => setShowHoverControls(roomCode)}
            onMouseLeave={() => setShowHoverControls('')}
          >
            <HMSRoom roomCode={roomCode} hideControls={codes.length > 1} />
            {showHoverControls === roomCode && <HoverControl onFocusRoom={() => setInFocusRoom(roomCode)} />}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
