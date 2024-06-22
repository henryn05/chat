import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useEffect } from "react";

const Chat = ({ db, isConnected, route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { username, background, userID } = route.params;

  let unsubChat;
  useEffect(() => {
    // If user is online, load data from firebase
    if (isConnected === true) {
      if (unsubChat) unsubChat();
        unsubChat = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubChat = onSnapshot(q, (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach(doc => {
            newMessages.push({ id: doc.id, ...doc.data() })
          });
          cacheMessages(newMessages);
          setLists(newMessages);
        });
      // If user is offline, load data from cache
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubChat) unsubChat();
    }
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const cacheMessages = await
      AsyncStorage.getItem("messages") || [];
  }
  // Lighten or darken the background color
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
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: adjustColor(background, -40),
          },
          left: {
            backgroundColor: adjustColor(background, 60),
          },
        }}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({ title: username });
    const q = query(
      // Queries and sorts chat messages in descending order
      // based on createdAt property
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsubChat = onSnapshot(q, (documentsShapshot) => {
      // Appends dates of messages and message to an array
      let newMessages = [];
      documentsShapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });
    return () => {
      // Clean up code to stop listening on Chat component
      if (unsubChat) unsubChat();
    };
  }, []);

  // Returns component with GiftedChat UI
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        style={styles.chatInput}
        renderBubble={renderBubble}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: username,
        }}
      />
      {(isConnected === true) ?
        <View style={styles.container}>
        </View> :
        null
      }
      {/*
        Prevents keyboard of Android devices from
        from blocking text input
      */}
      {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
