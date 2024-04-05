import { createElementWithClass, getRoomCodes } from './utils';
import './index.css';
import { RoomAdapter } from './RoomAdapter';

const roomAdapters = new Map();
let inFocusRoom = '';
const roomContainer = document.getElementById('room-container');
const roomCodes = getRoomCodes();

if (roomCodes.length > 0) {
  const infoElement = document.getElementById('info');
  infoElement?.remove();
}

for (const code of roomCodes) {
  let adapter;
  if (!roomAdapters.has(code)) {
    adapter = new RoomAdapter(code);
    adapter.onFocusChange(roomCode => {
      if (inFocusRoom === roomCode) {
        inFocusRoom = '';
        createRoomContainers();
        adapter.setInFocus(false);
      } else {
        inFocusRoom = roomCode;
        adapter.setInFocus(true);
        renderInFocusMode();
      }
      roomContainer.classList.toggle('focus');
    });
    roomAdapters.set(code, adapter);
  } else {
    adapter = roomAdapters.get(code);
  }

  adapter.joinRoom(code);
}

createRoomContainers();

function createRoomContainers() {
  roomContainer.innerHTML = '';
  const cols = Math.ceil(Math.sqrt(roomCodes.length));
  for (const code of roomCodes) {
    const adapter = roomAdapters.get(code);
    const tilesContainer = adapter.getContainer();
    tilesContainer.style.flex = `0 0 calc(${100 / cols}% - 4px`;
    roomContainer.appendChild(tilesContainer);
  }
}

function renderInFocusMode() {
  if (!inFocusRoom) {
    return;
  }
  roomContainer.innerHTML = '';
  const focusRoomAdapter = roomAdapters.get(inFocusRoom);
  const tilesContainer = focusRoomAdapter.getContainer();
  roomContainer.appendChild(tilesContainer);
  const container = createElementWithClass('div', 'in-focus-small-container');
  roomContainer.appendChild(container);
  roomCodes
    .filter(code => code !== inFocusRoom)
    .map(code => {
      const adapter = roomAdapters.get(code);
      const tilesContainer = adapter.getContainer();
      tilesContainer.style.flex = 'unset';
      container.appendChild(tilesContainer);
    });
}
