import { selectHLSState, useHMSStore } from '@100mslive/react-sdk';
import { HLS } from './HLS';
export const HLSContainer = () => {
  const hlsState = useHMSStore(selectHLSState);

  if (!hlsState.running) {
    return (
      <div className="center" style={{ width: '100%', height: '100%' }}>
        No Active Stream
      </div>
    );
  }

  return (
    <div className="hls-container">
      {hlsState.variants.map(({ url }) => {
        return (
          <div>
            <HLS url={url} key={url} />
          </div>
        );
      })}
    </div>
  );
};
