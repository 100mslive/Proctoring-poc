# Proctoring POC

This is a basic poc for proctoring use case.

[Demo](https://proctoring-poc-git-js-poc-100mslive.vercel.app/)

Get roomCodes from [100ms dashboard](https://dashboard.100ms.live) and append to the demo url in the following format:

?roomCodes=<code1>,<code2>
You can append as many roomCodes as you want. we recommend to limit it to 8.

## Features:
- Candidate Video is shown
- Candidate Screen is shown
- Multiple rooms can be joined at the same time
- One room can be enlarged

## Understanding the Code:

[RoomAdapter.js](./src/RoomAdapter.js)

This handles all the rendering of a single peer.

- Provides a method to join the room.
- Handles the video render by creating video element
- Handles screenshare render by creating screenshare element

[index.js]('./src/index.js)

This parses the roomCodes from the url. 

And for each roomCode, a RoomAdapter is created and stored in a `Map`.

All the rendering of the room is handled by the RoomAdapter as mentioned above.

This handles the focus on one room. Basically making one of the rooms take up more space to focus more on that particular room.
