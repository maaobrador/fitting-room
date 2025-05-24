import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { OrbitControls } from "@react-three/drei/native";

function GltfModel() {
  const model = useGLTF("http://192.168.43.241:8000/storage/model/dummyAvatar.glb");

  return( 
    <group position={[0, -1, 0]}>
  <primitive object={model.scene} />;
  </group>)
}

export const Avatar = ()=> {
  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator size="large" color="#fffff" />}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 35 }}>
          <color attach="background" args={["#ffff"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 0, 10]} intensity={1.5} />
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
