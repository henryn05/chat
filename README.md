## How Was This App Made
  This is a mobile application created via React-Native and tested through Expo.

  Firestore and Firebase served as the main database and storage for user messages.

## What Does This App Do
  Users are prompted to enter a username upon and select a background color for their chat room. Then, they can choose to enter a chat room.

  ![Start Screen](/img/start-screen-screenshot)

  Users can choose to type in a textbox and submit a plain text message or choose to submit one of three special actions.

  ![Chat Screen](/img/chat-screen-screenshot)

  The "plus" button opens up a modal that allows users to choose an image from their library, take a photo immediately through their camera, or share their location through maps.

## How to Run This App
  - Clone repository
  - Install Node.js & use v16.19.0 by running `nvm use 16.19.0`
  - Install Expo by running `npm install -g expo-cli`
  - Locate the `chat-app` folder and run `npm install` to initialize a `package.json` file

  - Set up Google Firebase by first signing in at
  https://firebase.google.com/
  - Then, create project
  - Select production mode
  - After creating the project, click on Project Overview >
  Project Settings > Your Apps
  - Copy configuration code (all the code inside of `const firebaseConfig = { ... }`)

  - Return to repository
  - Locate `chat-app` folder
  - Install Firebase through `npm install firebase`
  - Initialize Firebase by  pasting configuration code that you copied earlier inside of App.js

  - Download Expo Go app on mobile device or use emulator on PC
  - Open Expo Go app
  - Type in terminal of IDE `npx expo start` to start project on Expo Go app