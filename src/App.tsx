import { useRef, useState } from 'react';
import { HMSReactiveStore } from '@100mslive/react-sdk';
import './App.css';
import { HMSRoom } from './HMSRoom';
import { HoverControl } from './HoverControls';

const useSearchParams = (param: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
};

const storesMap = new Map<string, HMSReactiveStore>();

function App() {
  const roomCodes = useSearchParams('roomCodes')?.split(',') || [];
  const codes = useRef<string[]>(
    roomCodes.map(code => {
      if (!storesMap.has(code)) {
        const newStore = new HMSReactiveStore();
        newStore.triggerOnSubscribe();
        newStore.getActions().ignoreMessageTypes(['alert']);
        storesMap.set(code, newStore);
      }
      return code;
    }),
  );
  const [inFocusRoom, setInFocusRoom] = useState('');
  const [showHoverControls, setShowHoverControls] = useState('');

  if (roomCodes.length === 0) {
    return (
      <div className="center" style={{ width: '100%', height: '100%' }}>
        Please provide &nbsp;<b>comma(,)</b>&nbsp;separated roomCodes in search e.g. ?roomCodes=code1,code2
      </div>
    );
  }
  const cols = Math.ceil(Math.sqrt(roomCodes.length));
  return (
    <div
      style={{
        display: 'flex',
        placeContent: 'center',
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
          <div className="center" style={{ flex: '1 1 0', height: '100%', minWidth: 0 }}>
            <HMSRoom key={inFocusRoom} roomCode={inFocusRoom} store={storesMap.get(inFocusRoom)!} />
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
            {codes.current
              .filter(roomCode => roomCode !== inFocusRoom)
              .map(roomCode => (
                <div
                  key={roomCode}
                  style={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}
                  onMouseEnter={() => setShowHoverControls(roomCode)}
                  onMouseLeave={() => setShowHoverControls('')}
                >
                  <HMSRoom key={roomCode} roomCode={roomCode} store={storesMap.get(roomCode)!} />
                  {showHoverControls === roomCode && <HoverControl onFocusRoom={() => setInFocusRoom(roomCode)} />}
                </div>
              ))}
          </div>
        </>
      ) : (
        codes.current.map(roomCode => {
          if (!storesMap.get(roomCode)) {
            return null;
          }
          return (
            <div
              key={roomCode}
              style={{
                flex: inFocusRoom === roomCode ? '0 0 0' : `0 0 calc(${100 / cols}% - 4px`,
                minWidth: 0,
                position: 'relative',
              }}
              onMouseEnter={() => setShowHoverControls(roomCode)}
              onMouseLeave={() => setShowHoverControls('')}
            >
              <HMSRoom key={roomCode} roomCode={roomCode} store={storesMap.get(roomCode)!} />
              {showHoverControls === roomCode && <HoverControl onFocusRoom={() => setInFocusRoom(roomCode)} />}
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
