import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";


export default function ClotheStack(){
  return (
    <Stack>
        <Stack.Screen name="clotheslist" options={{title: 'Clothes', headerTitleAlign: 'center', }}/>
        <Stack.Screen name="[id]" options={{title: 'Try it!', headerTitleAlign:'center' }} />
    </Stack>
      )
}