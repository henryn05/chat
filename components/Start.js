import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { getAuth, signInAnonymously } from "firebase/auth";

import { useState } from "react";

const Start = ({ navigation }) => {
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("");

  const auth = getAuth();
  // Sign in user anonymously and returns username and background color
  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          username,
          background,
        });
        Alert.alert("Signed in successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

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
            {/* Creates button for each color*/}
            {colors.map((color, index) => (
              <TouchableOpacity
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  background === color && styles.selectedColor,
                ]}
                accessible={true}
                accessibilityLabel="Choose background color for chat room"
                accessibilityHint="Select background color for chat room"
                accessibilityRole="button"
                key={index}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            accessible={true}
            accessibilityLabel="Enter Chat Room"
            accessibilityHint="Lets you message another person"
            accessibilityRole="button"
            title="Enter Chat Room"
            onPress={() => signInUser()}
          >
            <Text>Chat Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/*
        Prevents keyboard of Apple devices from
        from blocking "Chat Now" button
      */}
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
  selectedColor: {
    borderColor: "#FCD95B",
    borderWidth: 3,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },
});

export default Start;
