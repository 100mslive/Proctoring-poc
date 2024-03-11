import {
  selectScreenShareByPeerID,
  selectVideoTrackByPeerID,
  useHMSStore,
  useVideo,
} from "@100mslive/react-sdk";

export const VideoTile = ({ peerId }: { peerId: string }) => {
  const track = useHMSStore(selectVideoTrackByPeerID(peerId));
  const screenTrack = useHMSStore(selectScreenShareByPeerID(peerId));
  const { videoRef } = useVideo({ trackId: screenTrack?.id || track?.id });

  return (
    <video
      playsInline
      muted
      autoPlay
      controls={false}
      ref={videoRef}
      style={{ width: "100%", height: "auto" }}
    />
  );
};
