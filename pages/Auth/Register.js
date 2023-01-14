import { Box, Button, Center, FormControl, Heading, Input, VStack, Text, HStack, useToast } from "native-base";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/actions/user.action";

const Register = ({ navigation }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const toast = useToast();
  const toastIdRef = useRef();

  const addToast = () => {
    toastIdRef.current = toast.show({
      render: () => {
        return (
          <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>User created correctly!</Text>
          </Box>
        )
      }
    })
  }

  const handleEmailInput = (e) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)) {
      setEmail(e)
      setError('')
    } else {
      setError('Please enter a valid Email')
    }
  }

  const handleSignup = () => {
    if (password === confirmPassword) {
      dispatch(signUp(email, password))
      addToast();
      setError('')
      navigation.navigate('Login')
    } else {
      setError('Passwords doesnt match')
    }
  }

  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
          fontWeight="semibold"
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input onChangeText={handleEmailInput} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChangeText={(e) => setPassword(e)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password"  onChangeText={(e) => setConfirmPassword(e)} />
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleSignup}>
            Sign up
          </Button>
          {error && <HStack justifyContent="center"><Text style={{color: 'red', fontWeight: 'bold'}}>{error}</Text></HStack>}
        </VStack>
      </Box>
    </Center>
  );
};

export default Register;
