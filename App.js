import Start from "./components/Start";
import Chat from "./components/Chat";

import { useEffect } from "react";
import { Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

const Stack = createNativeStackNavigator();

const App = () => {
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
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Storage
  const storage = getStorage(app);

  // Initialize Cloud Firestore
  const db = getFirestore(app);

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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
