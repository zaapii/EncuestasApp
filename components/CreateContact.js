import React, { useState, useEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Avatar,
  Center,
  Checkbox,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
  Button,
  useToast,
  Box,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const CreateContact = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [initials, setInitials] = useState("");

  const toast = useToast();
  const toastIdRef = useRef();

  const addToast = () => {
    toastIdRef.current = toast.show({
      render: () => {
        return (
          <Box bg="emerald.500" px="2" py="1" rounded="sm" color="white" mb={5}>
            Contact created correctly!
          </Box>
        );
      },
    });
  };

  const handleNameInput = (e) => {
    setName(e);
    if (e.includes(" ")) {
      const initial1 = e.split(" ")[0][0];
      const initial2 = e.split(" ")[1][0];
      initial1 &&
        initial2 &&
        setInitials(initial1.toUpperCase() + initial2.toUpperCase());
    } else {
      setInitials(name.substring(0, 2));
    }
  };

  const createContact = () => {
    const contact = {
      nameSurname: name,
      avatarUri: image,
      favourite,
      initials,
    };
    const contactsCollection = collection(db, "contacts");
    addDoc(contactsCollection, contact).then(async ({ id }) => {
      addToast();
      setImage(null);
      setName("");
      setFavourite(false);
      setInitials("");
      navigation.navigate("Contacts");
      const contactWithId = { ...contact, id: id };
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Center style={{ flex: 1, marginTop: 20 }}>
      <VStack space={20}>
        <HStack justifyContent="center" alignItems="center" width="90%">
          <Input
            onChangeText={handleNameInput}
            placeholder="Nombre y apellido del contacto"
            width="90%"
            borderRadius="4"
            py="3"
            px="1"
            fontSize="14"
            InputLeftElement={
              <Icon
                m="2"
                ml="3"
                size="6"
                color="gray.400"
                as={<MaterialCommunityIcons name="account" />}
              />
            }
          />
        </HStack>
        <HStack
          alignItems="center"
          width="90%"
          space={5}
          justifyContent="center"
        >
          <Text>Avatar</Text>
          <Avatar bg="indigo.500" source={{ uri: image }}>
            {initials ? initials : "EX"}
          </Avatar>
          <Button
            leftIcon={<Icon as={MaterialCommunityIcons} name="file-image" />}
            onPress={pickImage}
          >
            Pick an Image
          </Button>
        </HStack>
        <HStack justifyContent="center">
          <Checkbox
            value="green"
            colorScheme="green"
            size="md"
            icon={<Icon as={<MaterialCommunityIcons name="star-circle" />} />}
            onChange={(e) => setFavourite(e)}
          >
            Favourite Contact
          </Checkbox>
        </HStack>
        <HStack justifyContent="center">
          <Button
            onPress={createContact}
            leftIcon={<Icon as={MaterialCommunityIcons} name="account-plus" />}
            style={{ width: "90%" }}
          >
            Save Contact
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default CreateContact;
