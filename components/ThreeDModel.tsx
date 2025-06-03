import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useGLTF, OrbitControls } from "@react-three/drei/native";
import { Asset } from "expo-asset";

function AvatarModel() {
  // Load the avatar model from the local asset file
  const model = useGLTF(Asset.fromModule(require("@/assets/models/model.glb")).uri);
  return (
    <group position={[0, -1, 0]}>
      <primitive object={model.scene} />
    </group>
  );
}

function ClothesModel({ modelUri }: { modelUri: string }) {
  const model = useGLTF(modelUri);
  return (
    <group position={[0, -1, 0]} scale={[1, 1, 1]}>
      <primitive object={model.scene} />
    </group>
  );
}

export const ThreeDModel = ({ model, clothes }: { model: string; clothes: string }) => {
  if (!model || !clothes) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>Model or clothes URI missing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator size="large" color="#000" />}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 35 }}>
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 0, 10]} intensity={1.5} />

          {/* Render the avatar */}
          <AvatarModel />

          {/* Render the clothes model on top */}
          <ClothesModel modelUri={clothes} />

          <OrbitControls />
        </Canvas>
      </Suspense>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
