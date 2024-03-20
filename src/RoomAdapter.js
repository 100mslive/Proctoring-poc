import {
  HMSReactiveStore,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectRemotePeers,
} from '@100mslive/hms-video-store';
import { createElementWithClass, hasVideoTrack } from './utils';

export class RoomAdapter {
  #reactiveStore;
  #roomCode;
  #renderedPeers = new Set();
  #container;
  #hoverControls;
  #inFocus = false;
  #onFocusChange;

  constructor(roomCode) {
    if (!roomCode) {
      throw Error('Please pass a valid room code');
    }
    this.#reactiveStore = new HMSReactiveStore();
    this.#reactiveStore.triggerOnSubscribe();
    this.#roomCode = roomCode;
    this.#container = createElementWithClass('div', 'peer-tiles-container');
    this.#container.setAttribute('id', `${roomCode}-container`);
    this.#renderHoverControls();
    const store = this.#reactiveStore.getStore();
    store.subscribe(peers => this.#handlePeerUpdates(peers), selectRemotePeers);
  }

  joinRoom = async () => {
    const actions = this.#reactiveStore.getActions();
    const token = await actions.getAuthTokenByRoomCode({ roomCode: this.#roomCode });
    await actions.join({
      authToken: token,
      userName: `user-${this.#roomCode}`,
    });
  };

  getContainer = () => {
    return this.#container;
  };

  onFocusChange = cb => {
    this.#onFocusChange = cb;
  };

  setInFocus = inFocus => {
    this.#inFocus = inFocus;
    this.#container.classList.toggle('in-focus-large');
    const focus = document.getElementById(`${this.#roomCode}-focus`);
    if (focus) {
      focus.textContent = this.#inFocus ? 'fullscreen_exit' : 'fullscreen';
    }
  };

  #handlePeerUpdates = peers => {
    const peersContainer = document.getElementById(`${this.#roomCode}-container`);
    peers.forEach(async peer => {
      if (!this.#renderedPeers.has(peer.id) && hasVideoTrack(peer)) {
        peersContainer?.append(await this.#renderPeer(peer));
      }
    });
  };

  #renderHoverControls = () => {
    const hoverControls = createElementWithClass('div', 'hover-controls');
    const focus = createElementWithClass('span', 'material-symbols-outlined');
    focus.setAttribute('id', `${this.#roomCode}-focus`);
    focus.onclick = () => {
      this.#onFocusChange?.(this.#roomCode);
    };
    focus.textContent = this.#inFocus ? 'fullscreen_exit' : 'fullscreen';
    hoverControls.appendChild(focus);
    this.#hoverControls = hoverControls;
    this.#container.appendChild(hoverControls);
  };

  #renderPeer = async peer => {
    const hms = this.#reactiveStore;
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
    this.#renderedPeers.add(peer.id);
    return peerTileDiv;
  };
}
