export const getRoomCodes = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return (searchParams.get('roomCodes') || '').split(',');
};

export const hasVideoTrack = peer => {
  return peer.videoTrack || peer.auxiliaryTracks.some(track => track.type === 'video');
};
