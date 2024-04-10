import { useEffect } from 'react';
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
          .catch(console.error);
      })
      .catch(() => {});
  }, [actions, roomCode]);
  return null;
};

export const HMSRoom = ({ roomCode, store }: { roomCode: string; store: HMSReactiveStore }) => {
  return (
    <HMSRoomProvider actions={store.getActions()} store={store.getStore()} notifications={store.getNotifications()}>
      <AuthToken roomCode={roomCode}></AuthToken>
      {window.location?.pathname.includes('student') ? <Peers /> : <HLSContainer />}
      <Actions />
      <div className="snapshots"></div>
    </HMSRoomProvider>
  );
};
