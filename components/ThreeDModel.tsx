import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useGLTF, OrbitControls } from "@react-three/drei/native";

function GltfModel({ modelUri }: { modelUri: string }) {
  const model = useGLTF(modelUri);
  return (
    <group position={[0, -1, 0]}>
      <primitive object={model.scene} />
    </group>
  );
}

export const ThreeDModel = ({ model }: { model: string }) => {
  if (!model) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>No model URI provided.</Text>
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
          <GltfModel modelUri={model} />
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
    justifyContent: 'center',
  },
});
