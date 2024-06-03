import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <ImageBackground>
        <Text>Hello Screen1!</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here"
        />
        <TouchableOpacity
          title="Go to Screen 2"
          onPress={() => navigation.
            navigate("Chat", { name: name })
          }
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
});

export default StartScreen;
