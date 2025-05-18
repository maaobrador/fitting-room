
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@/components/Avatar";


export default function App() {
  return (
    <View style={styles.container}>
      <Avatar/>
    </View>

  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }})