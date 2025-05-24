import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Linking } from 'react-native';
import AuthContext from '@/components/AuthContext';
import { logout } from '@/services/AuthService';
import { useRouter, Stack } from 'expo-router';
import Constants from "expo-constants";
import { Button } from '@rneui/base';

const ProfileScreen = () => {
  <Stack.Screen
    options={{
      title: "Profile"
    }}
  />;
  
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Call your logout function to clear token/session
      console.log('Logout function:', logout);
      setUser(null);  // Clear the user from context
      router.replace('(auth)'); // Redirect to signin screen
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Loading user profile...</Text>
      </SafeAreaView>
    );
  }

  async function handleAR() {
    console.log("AR button pressed");
    const url = Constants.expoConfig?.extra?.AR_URL ?? '';

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Don't know how to open URI: ${url}`);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name || 'N/A'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email || 'N/A'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="AR Virtual Fitting"
          color="#10609B"
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={styles.button}
          onPress={handleAR}
        />

        <Button
          title="Log Out"
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={styles.button}
          onPress={handleLogout}
          color="#10609B"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10609B',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  profileInfo: {
    flex: 1, // Takes up available space
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end', // Align buttons to the bottom
    alignItems: 'center',
    paddingBottom: 20, // Padding from the bottom
  },
  button: {
    height: 40,
    width: 250,
    marginVertical: 10,
  },
});

export default ProfileScreen;
