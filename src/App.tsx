import { useRef, useState } from 'react';
import { HMSReactiveStore } from '@100mslive/react-sdk';
import './App.css';
import { HMSRoom } from './HMSRoom';
import { HoverControl } from './HoverControls';

const useSearchParams = (param: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
};

const stores = new Array<HMSReactiveStore>();

function App() {
  const roomCodes = useSearchParams('roomCodes')?.split(',') || [];
  const codes = useRef<string[]>(
    roomCodes.map((code, i) => {
      if (stores.length <= i) {
        const newStore = new HMSReactiveStore();
        newStore.triggerOnSubscribe();
        stores.push(newStore);
      }
      return code;
    }),
  );
  const [inFocusRoom, setInFocusRoom] = useState<number>(-1);
  const [showHoverControls, setShowHoverControls] = useState<number>(-1);

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
      {inFocusRoom >= 0 ? (
        <>
          <div className="center" style={{ flex: '1 1 0', height: '100%', minWidth: 0 }}>
            <HMSRoom key={inFocusRoom} roomCode={codes.current[inFocusRoom]} store={stores[inFocusRoom]} />
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
              .map((_, idx) => idx)
              .filter(idx => idx !== inFocusRoom)
              .map(idx => (
                <div
                  key={codes.current[idx]}
                  style={{ width: '100%', aspectRatio: 16 / 9, position: 'relative' }}
                  onMouseEnter={() => setShowHoverControls(idx)}
                  onMouseLeave={() => setShowHoverControls(-1)}
                >
                  <HMSRoom key={idx} roomCode={codes.current[idx]} store={stores[idx]} />
                  {showHoverControls === idx && <HoverControl onFocusRoom={() => setInFocusRoom(idx)} />}
                </div>
              ))}
          </div>
        </>
      ) : (
        codes.current.map((roomCode, idx) => {
          if (stores.length <= idx ) {
            return null;
          }
          return (
            <div
              key={roomCode}
              style={{
                flex: inFocusRoom === idx ? '0 0 0' : `0 0 calc(${100 / cols}% - 4px`,
                minWidth: 0,
                position: 'relative',
              }}
              onMouseEnter={() => setShowHoverControls(idx)}
              onMouseLeave={() => setShowHoverControls(-1)}
            >
              <HMSRoom key={roomCode} roomCode={roomCode} store={stores[idx]} />
              {showHoverControls === idx && <HoverControl onFocusRoom={() => setInFocusRoom(idx)} />}
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
