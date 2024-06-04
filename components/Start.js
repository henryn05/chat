import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useState } from "react";

const StartScreen = ({ navigation }) => {
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../img/background.png")}
      >
        <Text style={styles.title}>Let's Chat!</Text>
        <View style={styles.container2}>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Your Name"
          />
          <Text style={styles.selectionText}>Choose Background Color:</Text>
          <View style={styles.colorButtonContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: color }]}
                key={index}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            title="Enter Chat Room"
            onPress={() =>
              navigation.navigate(
                "ChatScreen",
                { username: username },
                { background: background }
              )
            }
          >
            <Text>Chat Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "88%",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  selectionText: {},
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginVertical: 20,
  },
  button: {
    fontSize: 16,
    fontWieght: "600",
    color: "#fff",
    backgroundColor: "#757083",
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 20,
  },
  colorButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    margin: 5,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },
});

export default StartScreen;
