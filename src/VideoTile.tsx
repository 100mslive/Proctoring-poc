import { selectScreenShareByPeerID, selectVideoTrackByPeerID, useHMSStore, useVideo } from '@100mslive/react-sdk';

const InsetTile = ({ trackId }: { trackId: string }) => {
  const { videoRef } = useVideo({ trackId: trackId });

  return (
    <div style={{ aspectRatio: '16/9', height: 130, position: 'absolute', bottom: 12, right: 12, borderRadius: 8 }}>
      <video
        playsInline
        muted
        autoPlay
        controls={false}
        ref={videoRef}
        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
      />
    </div>
  );
};

export const VideoTile = ({ peerId, name }: { peerId: string; name: string }) => {
  const videoTrack = useHMSStore(selectVideoTrackByPeerID(peerId));
  const screenTrack = useHMSStore(selectScreenShareByPeerID(peerId));
  const activeTrack = screenTrack || videoTrack;
  const { videoRef } = useVideo({ trackId: activeTrack?.id });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#191B23',
      }}
    >
      <video playsInline muted autoPlay controls={false} ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {activeTrack && videoTrack && activeTrack.id !== videoTrack.id ? <InsetTile trackId={videoTrack.id} /> : null}
      {!activeTrack?.enabled || (activeTrack.source !== 'screen' && activeTrack?.degraded) ? (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#C19A6B',
              color: 'white',
              fontSize: '1.5rem',
              width: 'min(64px, 25%)',
              aspectRatio: 1,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {name.substring(0, 2)}
          </div>
        </div>
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
