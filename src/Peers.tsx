import { selectRemotePeers, useHMSStore } from '@100mslive/react-sdk';
import { VideoTile } from './VideoTile';

export const Peers = () => {
  const peers = useHMSStore(selectRemotePeers);

  if (peers.length === 0) {
    return <div>No peers have joined yet</div>;
  }
  const cols = Math.ceil(Math.sqrt(peers.length));

  return (
    <div
      className="center"
      style={{
        flexFlow: 'row wrap',
        gap: 8,
        width: '100%',
        height: peers.length > 0 ? undefined : '100%',
      }}
    >
      {peers.length === 0
        ? 'No peers have joined yet'
        : peers.map(peer => (
            <div
              key={peer.id}
              className="center"
              style={{
                width: `calc(${Math.floor(100 / cols)}% - ${8 * (cols - 1)}px`,
                position: 'relative',
              }}
            >
              <VideoTile key={peer.id} peerId={peer.id} name={peer.name}></VideoTile>
            </div>
          ))}
    </div>
  );
};
