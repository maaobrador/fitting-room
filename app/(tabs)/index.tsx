import { Model } from "react-native-filament";
import { View, Text, StyleSheet } from "react-native";
import { ThreeDModel } from "@/components/ThreeDModel";


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Scan</Text>
      <ThreeDModel/>
    </View>

  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }})