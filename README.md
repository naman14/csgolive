# CS:GO Live

<a href="https://csgo-gsi.com">https://csgolive-b4b34.firebaseapp.com/</a>

CS:GO Live uses Valve's Game State Integration for CS:GO to collect game state changes and broadcast them.

- Broadcast games to everyone when you are playing. Anyone will be able to view your live game scores from website or app
- Save your game scores and details
- View your past games
- Watch live games that other users are broadcasting

<img src="https://raw.githubusercontent.com/naman14/csgolive/master/web/public/img/screen_csgolive_1.png" >

# Notes

- The apps are built with electron so expect large bundle sizes (~50mb)
- GSI throttle is set to 2 seconds which means that game state changes are broadcasted every 2 seconds (if there is a change in state). Any state changes in between 2 seconds will be sent in next update request.
- Make sure that your time (client computer) is accurate. GSI uses client side time time to send timestamps. If your time is not accurate then you may see 'User is not live'.
- Client server maintains a local socket connection (used by the client app) and a remote firebase connection for updating real time data.
- When you start the server, a config file is created every time and placed in the csgo cfg directory that app asks the user first time. If you want to change GSI settings, update the `gamestate_integration_csgolive.cfg` file after you start the server.

# Development

Apps are built with electron and the website is hosted with Firebase hosting.

To build the app - 
- `cd csgolive/app`
- `npm install`
- `electron .`

To test website changes -

- Install `firebase-cli`
- `cd csgolive/web`
- `firebase serve`
