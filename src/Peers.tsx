import { selectRemotePeers, useHMSStore } from '@100mslive/react-sdk';
import { VideoTile } from './VideoTile';

export const Peers = () => {
  const peers = useHMSStore(selectRemotePeers);

  if (peers.length === 0) {
    return <div>No peers have joined yet</div>;
  }
  const cols = Math.ceil(Math.sqrt(peers.length));
  const rows = Math.ceil(peers.length / cols);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        placeItems: 'center',
        gap: 8,
      }}
    >
      {peers.map(peer => (
        <VideoTile key={peer.id} peerId={peer.id} name={peer.name}></VideoTile>
      ))}
    </div>
  );
};
