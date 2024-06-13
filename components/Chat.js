import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { username, background } = route.params;

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
