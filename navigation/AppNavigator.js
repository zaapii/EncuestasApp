import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Pressable,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Button,
  Icon,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { logoutUser } from "../store/actions/user.action";
import Contacts from "../components/Contacts";
import SentAlerts from "../components/SentAlerts";
import CreateAlert from "../components/CreateAlert";
import CreateContact from "../components/CreateContact";
global.__reanimatedWorkletInit = () => {};
const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Contacts":
      return "account";
    case "SentAlerts":
      return "comment-alert";
    case "CreateAlert":
      return "alert-plus";
    case "CreateContact":
      return "account-plus";
    default:
      return undefined;
  }
};

const CustomDrawer = (props) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logoutUser());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="6" my="2" mx="1">
        <Box px="4">
          <Text bold color="gray.700">
            Bienvenido
          </Text>
          <Text fontSize="14" mt="1" color="gray.500" fontWeight="500">
            {user}
          </Text>
        </Box>
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                key={index}
                px="5"
                py="3"
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
                    : "transparent"
                }
                onPress={(event) => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "primary.500" : "gray.500"
                    }
                    size="5"
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "primary.500" : "gray.700"
                    }
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
          <Button onPress={logout}>Logout</Button>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
function MyDrawer() {
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        initialRouteName="Contacts"
        useLegacyImplementation
      >
        <Drawer.Screen name="Contacts" component={Contacts} />
        <Drawer.Screen name="SentAlerts" component={SentAlerts} />
        <Drawer.Screen name="CreateAlert" component={CreateAlert} />
        <Drawer.Screen name="CreateContact" component={CreateContact} />
      </Drawer.Navigator>
    </Box>
  );
}

export default function AppNavigator() {
  return (
    <MyDrawer />
  );
}