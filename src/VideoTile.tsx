import { VolumeTwoIcon, VolumeZeroIcon } from '@100mslive/react-icons';
import {
  HMSVideoTrack,
  selectPeerByID,
  selectScreenShareByPeerID,
  selectVideoTrackByPeerID,
  useHMSActions,
  useHMSStore,
  useVideo,
} from '@100mslive/react-sdk';
import { ROLES } from './constants';

const Avatar = ({ name }: { name: string }) => {
  return (
    <div
      className="center"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    >
      <div
        className="center"
        style={{
          background: '#C19A6B',
          color: 'white',
          fontSize: '1.5rem',
          width: 'min(64px, 25%)',
          aspectRatio: 1,
          borderRadius: '50%',
        }}
      >
        {name.substring(0, 2)}
      </div>
    </div>
  );
};

const InsetTile = ({ track, name }: { track: HMSVideoTrack; name: string }) => {
  const { videoRef } = useVideo({ trackId: track.id });

  return (
    <div
      style={{
        aspectRatio: '16/9',
        height: 130,
        width: 'max-content',
        position: 'absolute',
        bottom: 12,
        right: 12,
        borderRadius: 8,
        background: '#191B23',
      }}
    >
      <video
        playsInline
        muted
        autoPlay
        controls={false}
        ref={videoRef}
        style={{ height: '100%', width: 'auto', borderRadius: 8 }}
      />
      {!track.enabled || track.degraded ? <Avatar name={name}></Avatar> : null}
    </div>
  );
};

export const VideoTile = ({ peerId, name }: { peerId: string; name: string }) => {
  const videoTrack = useHMSStore(selectVideoTrackByPeerID(peerId));
  const screenTrack = useHMSStore(selectScreenShareByPeerID(peerId));
  const activeTrack = screenTrack || videoTrack;
  const { videoRef } = useVideo({ trackId: activeTrack?.id });
  const peerRole = useHMSStore(selectPeerByID(peerId))?.roleName;
  const isOnStage = peerRole === ROLES.STUDENT_ON_STAGE;
  const hmsActions = useHMSActions();

  return (
    <div
      style={{
        maxWidth: '100%',
        height: '100%',
        aspectRatio: '16/9',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#191B23',
      }}
    >
      <div
        style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer', zIndex: 100 }}
        onClick={() => hmsActions.changeRoleOfPeer(peerId, isOnStage ? ROLES.STUDENT : ROLES.STUDENT_ON_STAGE, true)}
      >
        {isOnStage ? <VolumeTwoIcon /> : <VolumeZeroIcon />}
      </div>
      <video playsInline muted autoPlay controls={false} ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {activeTrack && videoTrack && activeTrack.id !== videoTrack.id ? (
        <InsetTile track={videoTrack} name={name} />
      ) : null}
      {!activeTrack?.enabled || (activeTrack.source !== 'screen' && activeTrack?.degraded) ? (
        <Avatar name={name} />
      ) : (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: '#11131A',
            color: 'white',
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};
