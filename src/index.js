import { HMSReactiveStore, selectRemotePeers } from '@100mslive/hms-video-store';
import { getRoomCodes, hasVideoTrack } from './utils';

const storesMap = new Map();
const renderedPeers = new Set();

// document.onreadystatechange = () => {
// if (document.readyState === 'complete') {
const roomCodes = getRoomCodes();
for (const code of roomCodes) {
  let reactiveStore;
  if (!storesMap.has(code)) {
    reactiveStore = new HMSReactiveStore();
    storesMap.set(code, new HMSReactiveStore());
  } else {
    reactiveStore = storesMap.get(code);
  }
  await joinRoom(code);
  const store = reactiveStore.getStore();
  store.subscribe(peers => handlePeerUpdates(peers, code), selectRemotePeers);
}

async function joinRoom(roomCode) {
  const actions = storesMap.get(roomCode).getActions();
  const token = await actions.getAuthTokenByRoomCode({ roomCode });
  await actions.join({
    authToken: token,
    userName: `user-${roomCode}`,
  });
  const div = document.createElement('div');
  div.setAttribute('class', '');
  div.setAttribute('id', `${roomCode}-container peer-tiles`);
}

function handlePeerUpdates(peers, roomCode) {
  peers.forEach(peer => {
    if (!hasVideoTrack(peer)) {
      return;
    }
    const roomContainer = document.getElementById(`${roomCode}-container peer-tiles`);
    roomContainer.appendChild();
    renderedPeers.add(peer.id);
  });
}

// }
// };
