import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Button,
  Avatar,
  useToast,
} from "native-base";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { insertAlert } from "../db";
import * as Network from "expo-network";

const CreateAlert = (props) => {
  const styles = StyleSheet.create({
    image: {
      width: 250,
      height: 250,
      maxWidth: "80%",
      maxHeight: "100%",
    },
  });

  const isFocused = useIsFocused();
  const [contacts, setContacts] = useState([]);
  const [pickedUri, setPickedUri] = useState(null);
  const [pickedLocation, setPickedLocation] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const toast = useToast();
  const toastIdRef = useRef();

  const addToast = () => {
    toastIdRef.current = toast.show({
      render: () => {
        return (
          <Box bg="emerald.500" px="2" py="1" rounded="sm" color="white" mb={5}>
            Alert created correctly!
          </Box>
        );
      }
    });
  };

  async function getContacts() {
    setLoading(true);
    const contacts = [];
    const q = query(collection(db, "contacts"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      contacts.push(doc.data());
    });
    setContacts(contacts);
  }

  const isConnected = async () => {
    setIsOnline(await Network.getNetworkStateAsync());
  };

  const hasSelectedContact = () => {
    if (props.route.params && props.route.params.contact) {
      setSelectedContact(props.route.params.contact);
    }
  };

  useEffect(() => {
    if (isFocused) {
      hasSelectedContact();
      isConnected();
      verifyPermissionsLocation();
      getContacts();
      handlerGetLocation();
      setLoading(false);
    }
  }, [isFocused]);

  const createAlert = async () => {
    const alert = {
      contact: selectedContact.nameSurname,
      image: imageUrl,
      lat: pickedLocation.lat,
      lng: pickedLocation.lng,
    };
    if (isOnline.isInternetReachable) {
      console.log("online and sending");
      const alertsCollection = collection(db, "alerts");
      addDoc(alertsCollection, alert).then(async ({ id }) => {
        const alertWithId = { ...alert, id: id };
        console.log("doc added");
        setPickedLocation({});
        setImageUrl("");
        setSelectedContact(null);
        setImageUrl("");
        addToast();
        props.navigation.navigate("SentAlerts");
      });
    } else {
      const result = await insertAlert(
        selectedContact.nameSurname,
        imageUrl,
        pickedLocation.lat,
        pickedLocation.lng
      );
      console.log("added to database cause its offline", result);
    }
  };

  const verifyPermissionsCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  const verifyPermissionsLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  };

  const handlerTakeImage = async () => {
    const isCameraOk = await verifyPermissionsCamera();

    if (!isCameraOk) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPickedUri(result.assets[0].uri);
      uploadImage(pickedUri);
    }
  };

  const handlerGetLocation = async () => {
    const isGeoOk = await verifyPermissionsLocation();

    if (!isGeoOk) return;

    const location = await Location.getCurrentPositionAsync({ timeout: 5000 });

    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const uploadImage = async (image) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const imageRef = ref(storage, "images/" + uuidv4() + ".jpg");
    // 'file' comes from the Blob or File API
    uploadBytes(imageRef, blob).then((snapshot) => {
      getDownloadURL(imageRef).then((url) => {
        console.log(url);
        setImageUrl(url);
      });
    });
  };

  return (
    <Box safeArea flex={1}>
      <ScrollView>
        <VStack w="100%" space={5}>
          {!selectedContact ? (
            <HStack
              alignItems="center"
              justifyContent="center"
              maxH="40%"
              maxWidth="100%"
              padding="3"
            >
              <FlatList
                data={contacts}
                renderItem={({ item }) => (
                  <Box style={{ margin: 2 }}>
                    <Pressable
                      key={item.id}
                      onPress={() => setSelectedContact(item)}
                    >
                      <Box borderBottomWidth="1" borderColor="muted.300">
                        <HStack
                          space={3}
                          alignItems="center"
                          justifyContent="space-between"
                          marginBottom="0.5"
                        >
                          <Avatar
                            size="32px"
                            source={{
                              uri: item.avatarUri,
                            }}
                            bgColor="blue.500"
                          >
                            {item.initials}
                          </Avatar>
                          <Text color="coolGray.800" bold>
                            {item.nameSurname}
                          </Text>
                          <Icon
                            as={
                              <MaterialCommunityIcons
                                name={
                                  item.favourite ? "star-circle" : "star-off"
                                }
                              />
                            }
                            color={item.favourite ? "green.500" : "red.500"}
                            size="md"
                          />
                        </HStack>
                      </Box>
                    </Pressable>
                  </Box>
                )}
                keyExtractor={(item) => item.id}
              />
            </HStack>
          ) : (
            <HStack
              justifyContent="center"
              alignItems="center"
              style={{ marginTop: 10 }}
            >
              <Text>Creating alert for:</Text>
              <Box
                rounded="lg"
                borderColor="blue.500"
                borderWidth="1"
                padding="5"
                style={{ marginTop: 10 }}
              >
                <HStack
                  space={3}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Avatar
                    size="32px"
                    source={{
                      uri: selectedContact.avatarUri,
                    }}
                    bgColor="blue.500"
                  >
                    {selectedContact.initials}
                  </Avatar>
                  <Text color="coolGray.800" bold>
                    {selectedContact.nameSurname}
                  </Text>
                  <Icon
                    onPress={() => setSelectedContact(null)}
                    as={<MaterialCommunityIcons name="delete" />}
                    color="red.500"
                    size="md"
                  />
                </HStack>
              </Box>
            </HStack>
          )}

          <HStack justifyContent="center">
            {pickedUri && (
              <Image
                style={styles.image}
                source={{
                  uri: pickedUri,
                }}
              />
            )}
          </HStack>
          <HStack justifyContent="center">
            {pickedLocation ? (
              <Image
                style={styles.image}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${pickedLocation.lat},${pickedLocation.lng}&zoom=13&size=600x300&maptype=roadmap
  &markers=color:blue%7Clabel:ME%7C${pickedLocation.lat},${pickedLocation.lng}&key=AIzaSyBERHqrrty86YYMulp6ZDavjepoK6jXOsg`,
                }}
              ></Image>
            ) : (
              <Spinner style={styles.image} size="2xl" />
            )}
          </HStack>
          <HStack justifyContent="center">
            <Button onPress={handlerGetLocation}>Obtener Localización</Button>
          </HStack>
          <HStack justifyContent="center">
            <Button onPress={handlerTakeImage}>Tomar Foto</Button>
          </HStack>
          {
            <HStack justifyContent="center" style={{ marginBottom: 10 }}>
              <Button color="green.500" onPress={createAlert}>
                Enviar Alerta
              </Button>
            </HStack>
          }
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default CreateAlert;
