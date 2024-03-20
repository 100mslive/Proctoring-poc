import {
  HMSReactiveStore,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectRemotePeers,
} from '@100mslive/hms-video-store';
import { getRoomCodes, hasVideoTrack } from './utils';
import './index.css';

const storesMap = new Map();
const renderedPeers = new Set();

let inFocusRoom = '';
const roomCodes = getRoomCodes();
for (const code of roomCodes) {
  let reactiveStore;
  if (!storesMap.has(code)) {
    reactiveStore = new HMSReactiveStore();
    reactiveStore.triggerOnSubscribe();
    storesMap.set(code, reactiveStore);
  } else {
    reactiveStore = storesMap.get(code);
  }
  joinRoom(code).then(() => {
    const store = reactiveStore.getStore();
    store.subscribe(peers => {
      handlePeerUpdates(peers, code);
    }, selectRemotePeers);
  });
}

async function joinRoom(roomCode) {
  const actions = storesMap.get(roomCode).getActions();
  const token = await actions.getAuthTokenByRoomCode({ roomCode });
  await actions.join({
    authToken: token,
    userName: `user-${roomCode}`,
  });
  const cols = Math.ceil(Math.sqrt(roomCodes.length));
  const tilesContainer = createElementWithClass('div', 'peer-tiles-container');
  tilesContainer.setAttribute('id', `${roomCode}-container`);
  tilesContainer.style.flex = `0 0 calc(${100 / cols}% - 4px`;
  addHoverControls(roomCode, tilesContainer);
  const roomContainer = document.getElementById('room-container');
  roomContainer.appendChild(tilesContainer);
}

function handlePeerUpdates(peers, roomCode) {
  const peersContainer = document.getElementById(`${roomCode}-container`);
  if (!peersContainer) {
    return;
  }
  peers.forEach(async peer => {
    if (!renderedPeers.has(peer.id) && hasVideoTrack(peer)) {
      peersContainer.append(await renderPeer(peer, roomCode));
    }
  });
}

function createElementWithClass(tag, className) {
  const newElement = document.createElement(tag);
  newElement.className = className;
  return newElement;
}

async function renderPeer(peer, roomCode) {
  const hms = storesMap.get(roomCode);
  const hmsStore = hms.getStore();
  const hmsActions = hms.getActions();
  const peerTileDiv = createElementWithClass('div', 'peer-tile');
  const videoElement = createElementWithClass('video', 'peer-video');
  const peerTileName = createElementWithClass('div', 'peer-name');
  const peerAudioMuted = createElementWithClass('div', 'peer-audio-muted');
  const peerVideoMuted = createElementWithClass('div', 'peer-video-muted');
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.playsinline = true;
  peerTileName.textContent = peer.name;
  peerTileDiv.append(videoElement);
  peerTileDiv.append(peerTileName);
  peerTileDiv.append(peerAudioMuted);
  peerTileDiv.append(peerVideoMuted);
  peerTileDiv.id = `peer-tile-${peer.id}`;
  hmsStore.subscribe(enabled => {
    peerAudioMuted.style.display = enabled ? 'none' : 'flex';
    peerAudioMuted.innerHTML = `<span class="material-symbols-outlined">
    ${enabled ? 'mic' : 'mic_off'}
 </span>`;
  }, selectIsPeerAudioEnabled(peer.id));
  hmsStore.subscribe(enabled => {
    peerVideoMuted.style.display = enabled ? 'none' : 'flex';
    peerVideoMuted.innerHTML = `<span class="material-symbols-outlined">
         ${enabled ? 'videocam' : 'videocam_off'}
      </span>
    `;
  }, selectIsPeerVideoEnabled(peer.id));
  await hmsActions.attachVideo(peer.videoTrack, videoElement);
  renderedPeers.add(peer.id);
  return peerTileDiv;
}

function renderInFocusMode() {
  if (!inFocusRoom) {
    return;
  }
  renderedPeers.clear();
  const roomContainer = document.getElementById('room-container');
  const tilesContainer = createElementWithClass('div', 'peer-tiles-container in-focus-large');
  tilesContainer.setAttribute('id', `${inFocusRoom}-container`);
  tilesContainer.setAttribute('in-focus', 'yes');

  const store = storesMap.get(inFocusRoom).getStore();
  roomContainer.innerHTML = '';
  roomContainer.appendChild(tilesContainer);
  const container = createElementWithClass('div', 'in-focus-small-container');
  roomContainer.appendChild(container);

  addHoverControls(inFocusRoom, tilesContainer);

  handlePeerUpdates(store.getState(selectRemotePeers));
  roomCodes
    .filter(code => code !== inFocusRoom)
    .map(code => {
      const tilesContainer = createElementWithClass('div', 'peer-tiles-container in-focus-small');
      tilesContainer.setAttribute('id', `${code}-container`);
      const store = storesMap.get(inFocusRoom).getStore();
      handlePeerUpdates(store.getState(selectRemotePeers), code);
      addHoverControls(code, tilesContainer);
      container.appendChild(tilesContainer);
    });
}

function addHoverControls(roomCode, parent) {
  const hoverControls = createElementWithClass('div', 'hover-controls');
  const focus = createElementWithClass('span', 'material-symbols-outlined');
  focus.onclick = () => {
    if (inFocusRoom === roomCode) {
      inFocusRoom = '';
      roomCodes.forEach(roomCode => {
        const store = storesMap.get(roomCode).getStore();
        handlePeerUpdates(store.getState(selectRemotePeers));
      });
    } else {
      inFocusRoom = roomCode;
      renderInFocusMode();
    }
  };
  focus.textContent = inFocusRoom === roomCode ? 'fullscreen_exit' : 'fullscreen';
  hoverControls.appendChild(focus);
  parent.appendChild(hoverControls);
}
