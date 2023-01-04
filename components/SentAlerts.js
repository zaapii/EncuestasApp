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
import { FlatList, StyleSheet } from "react-native";
import { db } from "../firebase";
import { LogBox } from "react-native";
import { Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";

LogBox.ignoreLogs(["Setting a timer"]);

const SentAlerts = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    image: {
      width: 100,
      height: 100,
      maxWidth: "80%",
      maxHeight: "100%",
    },
  });

  async function getAlerts() {
    setLoading(true);
    const alertsFetch = [];
    const q = query(collection(db, "alerts"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      alertsFetch.push(doc.data());
    });
    setAlerts(alertsFetch);
  }

  useEffect(() => {
  if (isFocused) {
    getAlerts();
    setLoading(false);
  }
  }, [isFocused]);

  return (
    <>
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
        <Box style={{ padding: 10 }}>
          <FlatList
            data={alerts}
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
                <HStack
                  space={[2, 3]}
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Avatar
                    size="48px"
                    source={{
                      uri: item.image,
                    }}
                  >
                    {item.contact.split(" ")[0][0]}
                  </Avatar>
                  <VStack alignItems="center">
                    <Text
                      _dark={{
                        color: "warmGray.50",
                      }}
                      color="coolGray.800"
                      bold
                    >
                      {item.contact}
                    </Text>
                  </VStack>
                  <HStack justifyContent="center">
                    <Image
                      style={styles.image}
                      source={{
                        uri: `https://maps.googleapis.com/maps/api/staticmap?center=${item.lat},${item.lng}&zoom=13&size=600x300&maptype=roadmap
  &markers=color:blue%7Clabel:ME%7C${item.lat},${item.lng}&key=AIzaSyBERHqrrty86YYMulp6ZDavjepoK6jXOsg`,
                      }}
                    ></Image>
                  </HStack>
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />
          <Fab
            onPress={() => {}}
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
      )}
    </>
  );
};

export default SentAlerts;
