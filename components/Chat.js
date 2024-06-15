import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);
  const { username, background, userID } = route.params;

  // Custom onSend function to display chat interface
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  // Custom renderBubble function to change color of messages
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };
  useEffect(() => {
    const q = query(
      // Queries and sorts chat messages in descending order
      // based on createdAt property
      collection(db, "Chat").orderBy("createdAt", "desc"),
      where("uid", "==", userID)
    );
    const unsubChat = onSnapshot(q, (documentsShapshot) => {
      let newMessages = [];
      documentsShapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages);
    });
    return () => {
      // Clean up code to stop listening on Chat component
      if (unsubChat) unsubChat();
    };
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
      {/*
        Prevents keyboard of Android devices from
        from blocking text input
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
