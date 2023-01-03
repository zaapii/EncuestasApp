import AuthNavigator from "./AuthNavigator";
import AppNavigator from './AppNavigator';
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default () => {
  const user = useSelector(state => state.user)
  return (
    <NavigationContainer>
      { user ? <AppNavigator /> : <AuthNavigator /> }
    </NavigationContainer>
  )
}