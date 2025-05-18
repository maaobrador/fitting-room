import { StyleSheet, Text, View, Image, SafeAreaView, Linking } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Card, Button } from "@rneui/base";
import clothesLists from "@/assets/clothesLists";
import { defaultErrorImage } from "@/components/ClothesLists";
import { useState } from "react";
import { ThreeDModel } from "@/components/ThreeDModel"; // Import the 3D model component
import Constants from "expo-constants";

const ClothesScreen = () => {
  const { id } = useLocalSearchParams();
  const [show3DModel, setShow3DModel] = useState(false);
  const clothes = clothesLists.find((p) => p.id.toString() === id);

  if (!clothes) {
    return (
      <View style={styles.container}>
        <Text>Clothes not found</Text>
      </View>
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

  function handleAvatar() {
    console.log("Avatar button pressed");
    setShow3DModel(true); // Show the 3D model
  }

  // ✅ Show the 3D model viewer with the selected model
  if (show3DModel) {
    console.log('Model file:', clothes.model);
    return <ThreeDModel model={clothes.model} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <Button
          title="AR Try On"
          buttonStyle={{
            backgroundColor: '#10609B',
            borderRadius: 10,
          }}
          titleStyle={{ fontWeight: '500', fontSize: 18 }}
          containerStyle={{
            height: 50,
            width: 250,
            alignSelf: 'center',
            marginBottom: 10,
          }}
          onPress={handleAR}
        />

        <Button
          title="Avatar Try On"
          buttonStyle={{
            backgroundColor: '#10609B',
            borderRadius: 10,
          }}
          titleStyle={{ fontWeight: '500', fontSize: 18 }}
          containerStyle={{
            height: 50,
            width: 250,
            alignSelf: 'center',
          }}
          onPress={handleAvatar}
        />

        <Image
          source={{ uri: clothes.image || defaultErrorImage }}
          style={styles.image}
          resizeMode="contain"
        />
      </Card>
    </SafeAreaView>
  );
};

export default ClothesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardContainer: {
    borderRadius: 10,
    alignContent: 'center',
    height: '95%',
    padding: 10,
  },
  image: {
    aspectRatio: 2 / 3,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
  },
});
