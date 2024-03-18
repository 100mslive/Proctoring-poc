import { HMSRoomProvider, useHMSActions } from '@100mslive/react-sdk';
import { useEffect } from 'react';
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

export const HMSRoom = ({ roomCode }: { roomCode: string }) => {
  return (
    <HMSRoomProvider>
      <AuthToken roomCode={roomCode}></AuthToken>
      <Peers />
    </HMSRoomProvider>
  );
};
