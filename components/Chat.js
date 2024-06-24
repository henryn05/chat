import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bubble,
  InputToolbar,
  GiftedChat,
  Time,
  Day,
} from "react-native-gifted-chat";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import * as ImagePicker from "expo-image-picker";

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

  // Save messages to cache (AsyncStorage)
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };
  // Load messages from cache (AsyncStorage)
  const loadCachedMessages = async () => {
    const cacheMessages = (await AsyncStorage.getItem("messages")) || [];
  };
  // Lighten or darken message bubble color
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
  // Save sent messages to Firestore database
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom renderBubble to change color of messages
  const renderBubble = (props) => {
    if (background === "#090C08" || background === "#474056") {
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

  // Custom renderInputToolbar to display input toolbar
  // only if user is online
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Custom renderTime to change color of time
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

  // Custom renderDay to change color of day
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
