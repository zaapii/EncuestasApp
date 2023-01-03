import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../pages/Auth/LoginScreen";
import Register from "../pages/Auth/Register";

const Stack = createNativeStackNavigator()

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{headerShown: false}}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
)

export default AuthNavigator