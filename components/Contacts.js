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
  AlertDialog,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
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
  const isFocused = useIsFocused();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState({})

  const onCloseDialog = () => setDialogOpen(false);

  const cancelRef = useRef(null);

  const onRefresh = async () => {
    setLoading(true);
    await getContacts();
    setLoading(false);
  };

  const createNewAlert = () => {
    setDialogOpen(false);
    navigation.navigate(
      'CreateAlert',
      { contact: selectedContact },
    );
  }

  const showAlert = (item) => {
    setSelectedContact(item)
    setDialogOpen(true);
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
            style={{ marginTop: 40 }}
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
              <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={dialogOpen}
                onClose={onCloseDialog}
              >
                <AlertDialog.Content>
                  <AlertDialog.CloseButton />
                  <AlertDialog.Header>Create Alert</AlertDialog.Header>
                  <AlertDialog.Body>
                    <HStack width="100%"><Text>Create alert for {selectedContact.nameSurname}?</Text></HStack>
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button.Group space={2}>
                      <Button
                        variant="unstyled"
                        colorScheme="coolGray"
                        onPress={onCloseDialog}
                        ref={cancelRef}
                      >
                        Cancel
                      </Button>
                      <Button colorScheme="danger" onPress={() => createNewAlert()}>
                        Create
                      </Button>
                    </Button.Group>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog>
              {contacts.map((item, index) => (
                <Pressable key={index} onPress={() => showAlert(item)}>
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
