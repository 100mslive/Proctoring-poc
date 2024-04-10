import { selectLocalVideoTrackID, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import { useEffect } from 'react';

export const useImageCapture = () => {
  const videoTrackId = useHMSStore(selectLocalVideoTrackID);
  const hmsActions = useHMSActions();
  useEffect(() => {
    const container = document.querySelector('.snapshots');
    const id = videoTrackId;
    if (!id) {
      return;
    }
    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    setInterval(() => {
      const nativeTrack = hmsActions.getNativeTrackById(id);
      if (nativeTrack) {
        const { width = 320, height = 240 } = nativeTrack.getSettings();
        video.width = width;
        video.height = height;
        video.srcObject = new MediaStream([nativeTrack]);
        video.play();
        video.oncanplay = () => {
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const img = document.createElement('img');
            img.height = 120;
            img.crossOrigin = 'anonymous';
            img.src = canvas.toDataURL();
            container?.appendChild(img);
          }
        };
      }
    }, 5000);
  }, [videoTrackId, hmsActions]);
};
