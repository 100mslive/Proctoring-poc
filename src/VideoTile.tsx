import { selectScreenShareByPeerID, selectVideoTrackByPeerID, useHMSStore, useVideo } from '@100mslive/react-sdk';

export const VideoTile = ({ peerId, name }: { peerId: string; name: string }) => {
  const track = useHMSStore(selectVideoTrackByPeerID(peerId));
  const screenTrack = useHMSStore(selectScreenShareByPeerID(peerId));
  const activeTrack = screenTrack || track;
  const { videoRef } = useVideo({ trackId: activeTrack?.id });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#191B23' }}>
      <video playsInline muted autoPlay controls={false} ref={videoRef} style={{ width: '100%', height: 'auto' }} />
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
          <div style={{ background: '#C19A6B', color: 'white' }}>{name.substring(0, 2)}</div>
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
