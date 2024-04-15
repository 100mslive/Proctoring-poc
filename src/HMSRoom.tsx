import { useEffect, useRef, useState } from 'react';
import { HMSRoomProvider, useHMSActions, HMSReactiveStore } from '@100mslive/react-sdk';
import { Actions, Peers } from './Peers';
import { HLSContainer } from './HLSContainer';
import { useImageCapture } from './useImageCapture';

const AuthToken = ({ roomCode }: { roomCode: string }) => {
  const actions = useHMSActions();
  useImageCapture();

  useEffect(() => {
    if (!roomCode) {
      return;
    }
    actions
      .getAuthTokenByRoomCode({ roomCode }, { endpoint: 'https://auth-nonprod.100ms.live/v2/token' })
      .then(token => {
        actions
          .join({
            authToken: token,
            userName: `user-${roomCode}`,
            initEndpoint: 'https://qa-in2-ipv6.100ms.live/init',
          })
          .then(() => {
            actions.startHLSStreaming().catch(console.error);
          })
          .catch(console.error);
      })
      .catch(() => {});
  }, [actions, roomCode]);
  return null;
};

const FileHandler = () => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    const image = ref.current;
    if (!image) {
      return;
    }
    if (file) {
      image.src = URL.createObjectURL(file);
    } else {
      image.src = '';
    }
  }, [file]);

  return (
    <div className="file-container center">
      <input
        type="file"
        accept="image/*"
        id="target-image"
        onChange={e => {
          setFile(e.target.files?.[0]);
        }}
      />
      <img ref={ref}></img>
    </div>
  );
};

export const HMSRoom = ({ roomCode, store }: { roomCode: string; store: HMSReactiveStore }) => {
  const isStudent = window.location?.pathname.includes('student');
  return (
    <HMSRoomProvider actions={store.getActions()} store={store.getStore()} notifications={store.getNotifications()}>
      <AuthToken roomCode={roomCode}></AuthToken>
      {isStudent ? <Peers /> : <HLSContainer />}
      <Actions />
      <div className="snapshots">{isStudent ? <FileHandler /> : null}</div>
    </HMSRoomProvider>
  );
};
