import { Box, Button, Center, FormControl, Heading, Input, VStack } from "native-base";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/actions/user.action";

const Register = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = () => {
    if (password === confirmPassword) {
      dispatch(signUp(email, password))
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
            <Input onChangeText={(e) => setEmail(e)} />
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
        </VStack>
      </Box>
    </Center>
  );
};

export default Register;
