import { selectRemotePeers, useHMSStore } from "@100mslive/react-sdk";
import { VideoTile } from "./VideoTile";

export const Peers = () => {
  const peers = useHMSStore(selectRemotePeers);

  if(peers.length === 0) {
    return <div>No peers have joined yet</div>
  }

  return (
    <>
      {peers.map((peer) => (
        <VideoTile key={peer.id} peerId={peer.id}></VideoTile>
      ))}
    </>
  );
};
