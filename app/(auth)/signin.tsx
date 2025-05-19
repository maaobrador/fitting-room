import { Button } from '@rneui/base';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import FormTextField from '@/components/FormTextField';
import { View } from 'react-native';
import { Platform } from 'react-native';
import { login, loadUser } from '@/services/AuthService';


const SignInScreen = ({ }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  async function handleLogin() {

    console.log('Login', email, password);

    try {
      await login(
        {
          email,
          password,
          device_name: `${Platform.OS} ${Platform.Version}`
        });

      const user = await loadUser()

    } catch (e) {
      if (e.response.status === 401) {
      }
      console.log('Login failed', e.response.data);
    }
  }


  return (

    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false       //remove the header for sign in
        }} />

      <Text style={styles.title}> Fitting Room</Text>
      <Text style={styles.caption}> Fit smarter. Style better. Go virtual. </Text>
      {/* <Text>{user}</Text> */}
      {/* <Text style={{color:'red'}}>{error?.email ? error.email[0]}</Text> */}

      <View style={{ rowGap: 16 }}>
        <FormTextField
          label='Email Address:'
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType='email-address'
        />
        <FormTextField
          label='Password:'
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button
        title="Sign In"
        buttonStyle={{
          backgroundColor: '#10609B',
          borderRadius: 10,
        }}
        titleStyle={{ fontWeight: '500', fontSize: 18 }}
        containerStyle={{
          height: 50,
          width: 250,
          alignSelf: 'center',
          margin: 20
        }}
        onPress={() => { handleLogin() }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignSelf: 'center',
    marginTop: 50
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#10609B',
    marginBottom: -4,
    fontSize: 28,
  },
  caption: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#10609B',
    fontSize: 12,
    marginBottom: 50
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#10609B',
    marginVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
});

export default SignInScreen;