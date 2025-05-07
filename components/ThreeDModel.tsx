import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { OrbitControls } from "@react-three/drei/native";

function GltfModel() {
  const model = useGLTF(Asset.fromModule(require("@/assets/models/denimJacket.glb")).uri);
  return <primitive object={model.scene} />;
}

export const ThreeDModel = ()=> {
  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator size="large" color="#fffff" />}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 35 }}>
          <color attach="background" args={["#ffff"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={2} />
          <GltfModel />
          <OrbitControls />
        </Canvas>
      </Suspense>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
