import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import {
  Bubble,
  InputToolbar,
  GiftedChat,
  Time,
  Day,
} from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import CustomActions from "./CustomActions";

const Chat = ({ db, isConnected, route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  const { username, background, userID } = route.params;

  let unsubChat;
  useEffect(() => {
    navigation.setOptions({ title: username });
    // If user is online, load data from firebase
    if (isConnected === true) {
      if (unsubChat) unsubChat();
      unsubChat = null;
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubChat = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
      // If user is offline, load data from cache
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubChat) unsubChat();
    };
  }, [isConnected]);

  // Saves messages to cache (AsyncStorage)
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Loads messages from cache (AsyncStorage)
  const loadCachedMessages = async () => {
    const cacheMessages = (await AsyncStorage.getItem("messages")) || [];
  };

  // Lightens or darkens message bubble color
  const adjustColor = (color, amount) => {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  };

  // Saves sent messages to Firestore database
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Displays pickImage, takePhoto, and getLocation actions
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }
  // Renders mapView if messasge contains location
  const renderCustomView = (props) => {
    const {currentMessage} = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };
  // Changes color of messages
  const renderBubble = (props) => {
    if (background === "#090C08" || background === "#474056") {
      // Darker backgrounds have ligher messages
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: adjustColor(background, 60),
            },
            left: {
              backgroundColor: adjustColor(background, 40),
            },
          }}
          textStyle={{
            right: {
              color: "#fff",
            },
            left: {
              color: "#fff",
            },
          }}
        />
      );
    } else {
      // Lighter backgrounds have darker messages
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: adjustColor(background, -40),
            },
            left: {
              backgroundColor: adjustColor(background, -20),
            },
          }}
          textStyle={{
            right: {
              color: "#fff",
            },
            left: {
              color: "#fff",
            },
          }}
        />
      );
    }
  };

  // Displays input toolbar only if user is online
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Changes color of time
  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: "#fff",
          },
          left: {
            color: "#fff",
          },
        }}
      />
    );
  };

  // Changes color of day
  const renderDay = (props) => {
    return (
      <Day
        {...props}
        textStyle={{
          color: "#fff",
        }}
      />
    );
  };

  // Returns component with GiftedChat UI
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        style={styles.chatInput}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderTime={renderTime}
        renderDay={renderDay}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: username,
        }}
      />
      {/*
        Prevents Android keyboard from blocking text input
      */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
