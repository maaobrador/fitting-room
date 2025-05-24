import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from '@rneui/base';
import { Link, Redirect } from 'expo-router';
import { loadUser } from '@/services/AuthService';

import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from './(auth)/signin';

const index = () => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>

    <Link href={'/signin'} asChild>
        <Button title="Sign in" />
    </Link>
    <Link href={'/signup'} asChild>
        <Button title="Register" />
    </Link>
    </View>


  //   <AuthProvider.Provider value={ {user, setUser}}>
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       {user ? (
  //         <>
  //         <Stack.Screen name="Home" component={HomeStack} />
  //         </>
  //       ): (
  //         <>
  //         <Stack.Screen name="Login" component={SignInScreen} />
  //         </>
  //         )}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // </AuthProvider.Provider>
  );
};

export default index;