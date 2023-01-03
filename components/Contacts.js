import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Actionsheet,
  Avatar,
  Box,
  Button,
  Center,
  Fab,
  HStack,
  Icon,
  Spacer,
  Spinner,
  Text,
  useDisclose,
  VStack,
  Pressable,
  ScrollView,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { LogBox } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

LogBox.ignoreLogs([
  "Setting a timer",
  "VirtualizedLists should never be nested",
]);

const Contacts = ({ navigation }) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused()

  const onRefresh = async () => {
    setLoading(true);
    await getContacts();
    setLoading(false);
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

  useEffect(() => {
    if (isFocused) {
      getContacts();
      setLoading(false);
    }
  }, [isFocused]);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <HStack
            space={8}
            justifyContent="center"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Spinner size="lg" />
          </HStack>
        ) : (
          <>
            <Center>
              <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
                <Actionsheet.Content>
                  <Box w="100%" h={60} px={4} justifyContent="center">
                    <Text
                      fontSize="16"
                      color="gray.500"
                      _dark={{
                        color: "gray.300",
                      }}
                    >
                      Create
                    </Text>
                  </Box>
                  <Actionsheet.Item
                    startIcon={
                      <Icon
                        as={MaterialCommunityIcons}
                        size="6"
                        name="account"
                      />
                    }
                    onPress={() => navigation.navigate("CreateContact")}
                  >
                    Contact
                  </Actionsheet.Item>
                  <Actionsheet.Item
                    startIcon={
                      <Icon
                        as={MaterialCommunityIcons}
                        name="alert-circle"
                        size="6"
                      />
                    }
                    onPress={() => navigation.navigate("CreateAlert")}
                  >
                    Alert
                  </Actionsheet.Item>
                </Actionsheet.Content>
              </Actionsheet>
            </Center>
            <Box style={{ padding: 10 }}>
              {contacts.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => console.log("I'm Pressed")}
                >
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: "muted.50",
                    }}
                    borderColor="muted.800"
                    pl={["0", "4"]}
                    pr={["0", "5"]}
                    py="2"
                  >
                    <HStack
                      space={3}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Avatar
                        size="48px"
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
                            name={item.favourite ? "star-circle" : "star-off"}
                          />
                        }
                        color={item.favourite ? "green.500" : "red.500"}
                        size="xl"
                      />
                    </HStack>
                  </Box>
                </Pressable>
              ))}
              <Fab
                onPress={onOpen}
                position="absolute"
                size="sm"
                icon={
                  <Icon
                    color="white"
                    as={<MaterialCommunityIcons name="plus" />}
                    size="sm"
                  />
                }
              ></Fab>
              <Fab
                onPress={onOpen}
                position="absolute"
                size="sm"
                icon={
                  <Icon
                    color="white"
                    as={<MaterialCommunityIcons name="plus" />}
                    size="sm"
                  />
                }
              ></Fab>
            </Box>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Contacts;
