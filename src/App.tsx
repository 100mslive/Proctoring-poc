import { useState } from 'react';
import './App.css';
import { HMSRoom } from './HMSRoom';
import { HoverControl } from './HoverControls';

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
      <div className="center" style={{ width: '100%', height: '100%' }}>
        Please provide &nbsp;<b>comma(,)</b>&nbsp;separated roomCodes in search e.g. ?roomCode=code1,code2
      </div>
    );
  }
  const codes = roomCodes.split(',');
  const cols = Math.ceil(Math.sqrt(codes.length));
  return (
    <div
      className="center"
      style={{
        flexFlow: 'row wrap',
        height: '100%',

        gap: 8,
        overflow: 'hidden',
        padding: 24,
      }}
    >
      {inFocusRoom ? (
        <>
          <div className="center" style={{ flex: '1 1 0', height: '100%', minWidth: 0 }}>
            <HMSRoom key={inFocusRoom} roomCode={inFocusRoom} />
          </div>
          <div
            style={{
              flexDirection: 'column',
              display: 'flex',
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
                  <HMSRoom key={roomCode} roomCode={roomCode} />
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
              position: 'relative',
            }}
            onMouseEnter={() => setShowHoverControls(roomCode)}
            onMouseLeave={() => setShowHoverControls('')}
          >
            <HMSRoom key={roomCode} roomCode={roomCode} />
            {showHoverControls === roomCode && <HoverControl onFocusRoom={() => setInFocusRoom(roomCode)} />}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
