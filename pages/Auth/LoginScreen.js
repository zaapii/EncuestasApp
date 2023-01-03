import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  Link,
  VStack,
  Text,
  Spinner,
} from "native-base";
import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/actions/user.action";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        dispatch(setUser(userCredential.user.email));
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  return (
    <KeyboardAvoidingView behaviour="padding" keyboardVerticalOffset={200}>
      <ScrollView>
        <Center w="100%">
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              <Text style={{ fontSize: 30 }}>Bienvenido</Text>
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
            >
              Inicia sesión para continuar
            </Heading>

            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input onChangeText={(e) => setEmail(e)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input onChangeText={(e) => setPassword(e)} type="password" />
              </FormControl>
              <HStack justifyContent="center" style={{ marginTop: 20 }}>
                <Button
                  mt="2"
                  colorScheme="indigo"
                  onPress={handleLogin}
                  maxW={Dimensions.get("window").width - 40}
                  w="80%"
                >
                  {loading ? (
                    <Spinner color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                      }}
                    >
                      Ingresar
                    </Text>
                  )}
                </Button>
              </HStack>
              <HStack justifyContent="center">
                <Text>
                  {error && (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 15,
                        fontWeight: "bold"
                      }}
                    >
                      {error}
                    </Text>
                  )}
                </Text>
              </HStack>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Soy un usuario nuevo.{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => {
                    navigation.navigate("Register");
                  }}
                >
                  Registrarse
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
