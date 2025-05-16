import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { OrbitControls } from "@react-three/drei/native";

function GltfModel() {
  const model = useGLTF(Asset.fromModule(require("@/assets/models/dummyAvatar.glb")).uri);

  return( 
    <group position={[0, -1, 0]}>
  <primitive object={model.scene} />;
  </group>)
}

function GltfModel2() {
  const model = useGLTF(Asset.fromModule(require("@/assets/models/flouncingBlouse.glb")).uri);

  return( 
    <group position={[0, 0.18, 0]} scale={[0.43, 0.43, 0.43]}>
  <primitive object={model.scene} />;
  </group>)
}

export const ThreeDModel = ()=> {
  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator size="large" color="#fffff" />}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 35 }}>
          <color attach="background" args={["#ffff"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 0, 10]} intensity={1.5} />
          <GltfModel />
          <GltfModel2/>
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
