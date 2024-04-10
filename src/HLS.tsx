import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export const HLS = ({ url }: { url: string }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (url && Hls.isSupported() && ref.current) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 20,
        backBufferLength: 10,
        abrBandWidthUpFactor: 1,
        playlistLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: 8000,
            maxLoadTimeMs: 20000,
            timeoutRetry: {
              maxNumRetry: 10,
              retryDelayMs: 1000,
              maxRetryDelayMs: 8000,
              backoff: 'exponential',
            },
            errorRetry: {
              maxNumRetry: 10,
              retryDelayMs: 1000,
              maxRetryDelayMs: 8000,
              backoff: 'exponential',
            },
          },
        },
      });
      hls.loadSource(url);
      hls.attachMedia(ref.current);
    }
  }, [url]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <video autoPlay playsInline ref={ref} style={{ height: '100%', width: 'auto', maxWidth: '100%' }} controls />
    </div>
  );
};
