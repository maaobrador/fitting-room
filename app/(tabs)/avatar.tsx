
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@/components/Avatar";
import { LogBox } from "react-native";



export default function App() {
  LogBox.ignoreAllLogs();
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