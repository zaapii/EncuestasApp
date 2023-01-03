import 'react-native-gesture-handler';
import React from "react";
import {
  Text,
  HStack,
  Switch,
  useColorMode,
  extendTheme,
  NativeBaseProvider,
} from "native-base";
import { Provider } from "react-redux";
import MainNavigator from './navigation'
import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './store/index'
import thunk from 'redux-thunk';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

let store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
  )
)


// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </NativeBaseProvider>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
