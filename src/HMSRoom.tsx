import { useEffect } from 'react';
import { HMSRoomProvider, useHMSActions, HMSReactiveStore } from '@100mslive/react-sdk';
import { Peers } from './Peers';

const AuthToken = ({ roomCode }: { roomCode: string }) => {
  const actions = useHMSActions();

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
      <Peers />
    </HMSRoomProvider>
  );
};
