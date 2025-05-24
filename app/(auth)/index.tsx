import { Button } from '@rneui/base';
import { Stack } from 'expo-router';
import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AuthContext from '@/components/AuthContext'; // Import the AuthContext
import FormTextField from '@/components/FormTextField';
import { login, loadUser } from '@/services/AuthService';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useContext(AuthContext); // Get setUser from context

  async function handleLogin() {
    console.log('Login', email, password);

    try {
      await login({
        email,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });

      const user = await loadUser();
      console.log('User loaded:', user);

      setUser(user); // Set the user in AuthContext
      router.replace('(tabs)'); // Navigate to the main tab layout
    } catch (e) {
      if (e.response?.status === 401) {
        console.log('Unauthorized:', e.response.data);
      } else {
        console.log('Login failed:', e.message);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}>Fitting Room</Text>
      <Text style={styles.caption}>Fit smarter. Style better. Go virtual.</Text>

      <View style={{ rowGap: 16 }}>
        <FormTextField
          label="Email Address:"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <FormTextField
          label="Password:"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
          margin: 20,
        }}
        onPress={handleLogin}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignSelf: 'center',
    marginTop: 50,
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
    marginBottom: 50,
  },
});

export default SignInScreen;
