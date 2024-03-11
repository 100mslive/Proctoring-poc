import { HMSRoomProvider, useHMSActions } from '@100mslive/react-sdk';
import { useEffect } from 'react';
import { Peers } from './Peers';

const AuthToken = ({ roomCode, userId }: { roomCode: string; userId: string }) => {
  const actions = useHMSActions();

  useEffect(() => {
    if (!roomCode) {
      return;
    }
    actions
      .getAuthTokenByRoomCode({ roomCode, userId })
      .then(token => {
        actions
          .join({
            authToken: token,
            userName: userId,
          })
          .catch(console.error);
      })
      .catch(() => {});
  }, [actions, roomCode, userId]);
  return null;
};

export const HMSRoom = ({ roomCode, userId }: { roomCode: string; userId: string }) => {
  return (
    <HMSRoomProvider>
      <AuthToken roomCode={roomCode} userId={userId}></AuthToken>
      <Peers />
    </HMSRoomProvider>
  );
};
