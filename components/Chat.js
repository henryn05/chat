import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useEffect } from "react";

const Chat = ({ db, isConnected, route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { username, background } = route.params;

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
  // Custom onSend function to display chat interface
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  // Custom renderBubble function to change color of messages
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        },
      }}
    />
  }
  useEffect((username) => {
    //Starting messages with specific format
    //when user enters chat room
    setMessages([
      {
        _id: 1,
        text: "Hello Developer!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "You have entered the chat",
        createdAt: new Date(),
        system: true,
      }
    ]);
  }, []);
  //
  useEffect(() => {
    navigation.setOptions({ title: username });
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
          _id: 1,
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
