import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Avatar,
  Box,
  Fab,
  HStack,
  Icon,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { db } from "../firebase";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

const SentAlerts = ({navigation}) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getEmails() {
    setLoading(true);
    const emailsFetch = [];
    const q = query(collection(db, "emails"), where("type", "==", "Outbox"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      emailsFetch.push(doc.data());
    });
    setEmails(emailsFetch);
  }

  useEffect(() => {
    getEmails();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {loading ? (
        <HStack space={8} justifyContent="center" alignItems="center" style={{marginTop: 20}}>
          <Spinner size="lg" />
        </HStack>
      ) : (
        <Box style={{ padding: 10 }}>
          <FlatList
            data={emails}
            renderItem={({ item }) => (
              <Box
                key={item.id}
                borderBottomWidth="1"
                _dark={{
                  borderColor: "muted.50",
                }}
                borderColor="muted.800"
                pl={["0", "4"]}
                pr={["0", "5"]}
                py="2"
              >
                <HStack space={[2, 3]} justifyContent="space-between">
                  {item.avatarUrl && <Avatar
                    size="48px"
                    source={{
                      uri: item.avatarUrl,
                    }}
                  />}
                  <VStack>
                    <Text
                      _dark={{
                        color: "warmGray.50",
                      }}
                      color="coolGray.800"
                      bold
                    >
                      {item.fullName}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: "warmGray.200",
                      }}
                    >
                      {item.emailBody}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start"
                  >
                    {item.timeStamp?.toString()}
                  </Text>
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
        <Fab onPress={() => {}} position="absolute" size="sm" icon={<Icon color="white" as={<MaterialCommunityIcons name="plus" />} size="sm" />}></Fab>
        </Box>
      )}
    </>
  );
};

export default SentAlerts;
