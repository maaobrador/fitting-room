import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

const Index = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Fitting Room</Text>
      <Link href="/signin" asChild>
        <Button title="Sign In" />
      </Link>
      <Link href="/signup" asChild>
        <Button title="Sign Up" />
      </Link>
    </View>
  );
};

export default Index;
