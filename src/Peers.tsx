import { selectIsAllowedToPublish, selectPeers, useAVToggle, useHMSStore, useScreenShare } from '@100mslive/react-sdk';
import { VideoTile } from './VideoTile';
import { MicOffIcon, MicOnIcon, ShareScreenIcon, VideoOffIcon, VideoOnIcon } from '@100mslive/react-icons';

export const Actions = () => {
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
  const { toggleScreenShare } = useScreenShare();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  return (
    <div className="center actions" style={{ height: 56, gap: 12 }}>
      {toggleAudio && <div onClick={toggleAudio}>{isLocalAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}</div>}
      {toggleVideo && <div onClick={toggleVideo}>{isLocalVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}</div>}
      {isAllowedToPublish.screen && (
        <div
          onClick={async () => {
            await toggleScreenShare?.();
          }}
        >
          <ShareScreenIcon />
        </div>
      )}
    </div>
  );
};

export const Peers = () => {
  const peers = useHMSStore(selectPeers);
  const peersWithTrack = peers.filter(peer => peer.audioTrack || peer.videoTrack || peer.auxiliaryTracks.length > 0);
  const cols = Math.ceil(Math.sqrt(peersWithTrack.length));

  return (
    <div
      className="center"
      style={{
        flexFlow: 'row wrap',
        placeContent: 'center',
        gap: 8,
        width: '100%',
        flex: '1 1 0',
        minHeight: 130,
      }}
    >
      {peersWithTrack.length === 0
        ? 'No one with video/audio/screenshare has joined yet'
        : peersWithTrack.map(peer => (
            <div
              key={peer.id}
              className="center"
              style={{
                width: `calc(${Math.floor(100 / cols)}% - 4px)`,
                position: 'relative',
              }}
            >
              <VideoTile key={peer.id} peerId={peer.id} name={peer.name}></VideoTile>
            </div>
          ))}
    </div>
  );
};
