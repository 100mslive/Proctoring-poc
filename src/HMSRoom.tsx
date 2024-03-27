import { HMSPrebuilt } from '@100mslive/roomkit-react';

export const HMSRoom = ({
  roomCode,
  userId,
  hideControls = false,
}: {
  roomCode: string;
  userId?: string;
  hideControls: boolean;
}) => {
  const overrideLayout = hideControls
    ? {
        conferencing: {
          default: {
            hideSections: ['footer', 'header'],
            elements: {
              video_tile_layout: {
                grid: {
                  enable_local_tile_inset: false,
                  hide_participant_name_on_tile: false,
                  rounded_video_tile: true,
                  hide_audio_mute_on_tile: true,
                  video_object_fit: 'contain',
                  edge_to_edge: true,
                  hide_metadata_on_tile: true,
                },
              },
            },
          },
        },
      }
    : {};
  return (
    <div id={`${roomCode}-container`} style={{ width: '100%', height: '100%' }}>
      <HMSPrebuilt
        roomCode={roomCode}
        containerSelector={`#${roomCode}-container`}
        options={{
          userId,
          userName: userId,
          endpoints: {
            tokenByRoomCode: 'https://auth-nonprod.100ms.live/v2/token',
            roomLayout: 'https://api-nonprod.100ms.live/v2/layouts/ui',
            init: 'https://qa-in2-ipv6.100ms.live/init',
          },
        }}
        screens={{
          preview: {
            skip_preview_screen: true,
          },
          ...overrideLayout,
        }}
      />
    </div>
  );
};
