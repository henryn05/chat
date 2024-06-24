import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";

import { useActionSheet } from "@expo/react-native-action-sheet";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const actionSheet = useActionSheet();

  // Allows user to select 1 out of 3 actions
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Photo",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            console.log("user wants to pick an image");
            return;
          case 1:
            takePhoto();
            console.log("user wants to take a photo");
            return;
          case 2:
            getLocation();
            console.log("user wants to share their current location");
            return;
        }
      }
    );
  };

  // Allows user to select photos and videos from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      // if user cancels process and doesn't pick file,
      // setImage will remain empty
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        uploadAndSendImage(imageURI);
      } else Alert.alert("Permission to select images denied");
    }
  };

  // Allows user to take a photo
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        let mediaLibraryPermissions =
          await MediaLibrary.requestPermissionsAsync();

        if (mediaLibraryPermissions?.granted)
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        const imageURI = result.assets[0].uri;
        uploadAndSendImage(imageURI);
      }
    }
  };

  // Allows user to retrieve their location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        // Object instide of location contains necessary data
        // for renderCustomView to render a map
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else {
        Alert.alert("Error occured while retrieving location");
      }
    } else {
      Alert.alert("Permissions to read location denied");
    }
  };

  // Generates a unique reference in Firebase Storage
  // for each image uploaded (nested inside pickImage)
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];

    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Uploads image to Firebase Storage and sends as message
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRef = generateReference(imageURI);
    const response = await fetch(imageURI);
    const blob = await response.blob();

    const newUploadRef = ref(storage, uniqueRef);
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      console.log("File has been uploaded successfully");
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 20,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
