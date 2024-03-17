import { FitScreenIcon } from '@100mslive/react-icons';

export const HoverControl = ({ onFocusRoom }: { onFocusRoom: () => void }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0, 0.4)',
      }}
    >
      <div onClick={onFocusRoom}>
        <FitScreenIcon width={48} height={48} />
      </div>
    </div>
  );
};
