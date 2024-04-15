import { useEffect, useRef, useState } from 'react';
import { HMSRoomProvider, useHMSActions, HMSReactiveStore, useHMSStore, selectPermissions } from '@100mslive/react-sdk';
import { Actions, Peers } from './Peers';
import { HLSContainer } from './HLSContainer';
import { useImageCapture } from './useImageCapture';

const AuthToken = ({ roomCode }: { roomCode: string }) => {
  const actions = useHMSActions();
  const permissions = useHMSStore(selectPermissions);
  useImageCapture();

  useEffect(() => {
    if (!roomCode) {
      return;
    }
    actions
      .getAuthTokenByRoomCode({ roomCode })
      .then(token => {
        actions
          .join({
            authToken: token,
            userName: `user-${roomCode}`,
          })
          .then(() => {
            if (permissions?.hlsStreaming) {
              actions.startHLSStreaming().catch(console.error);
            }
          })
          .catch(console.error);
      })
      .catch(() => {});
  }, [actions, roomCode, permissions]);
  return null;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
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
      {isStudent ? <Actions /> : null}
      {/* <div className="snapshots">{isStudent ? <FileHandler /> : null}</div> */}
    </HMSRoomProvider>
  );
};
