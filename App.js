import Start from "./components/Start";
import Chat from "./components/Chat";

import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork
} from "firebase/firestore";
const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBtqLEOYftkORr3tUzbHqNPe8VCKqz49KM",
    authDomain: "chat-app-72372.firebaseapp.com",
    projectId: "chat-app-72372",
    storageBucket: "chat-app-72372.appspot.com",
    messagingSenderId: "680396641879",
    appId: "1:680396641879:web:460071b55b2648e0d4b512",
    measurementId: "G-BQ6QDHJREM",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get reference to service
  const db = getFirestore(app);

  // Firebase config copy and pasted from Firebase Console
  const firebaseConfig = {
    apiKey: "AIzaSyBtqLEOYftkORr3tUzbHqNPe8VCKqz49KM",
    authDomain: "chat-app-72372.firebaseapp.com",
    projectId: "chat-app-72372",
    storageBucket: "chat-app-72372.appspot.com",
    messagingSenderId: "680396641879",
    appId: "1:680396641879:web:460071b55b2648e0d4b512",
    measurementId: "G-BQ6QDHJREM",
  };
  //Alerts user when connection is lost
  const connectionStatus = useNetInfo();
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {/*
            Passes db collection into chat component
          */}
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      <Stack.Navigator
        initialRouteName="Screen1"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
