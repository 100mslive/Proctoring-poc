import { FitScreenIcon } from '@100mslive/react-icons';

export const HoverControl = ({ onFocusRoom }: { onFocusRoom: () => void }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 80,
        height: 80,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(currentColor, 0.4)',
        cursor: 'pointer',
      }}
    >
      <div onClick={onFocusRoom}>
        <FitScreenIcon width={48} height={48} />
      </div>
    </div>
  );
};
