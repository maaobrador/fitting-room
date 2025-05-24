import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE = Constants.expoConfig?.extra?.API_BASE;

const GltfModel = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} position={[0, -1, 0]} />;
};

export default function ModelViewer({ route }) {
  const { timestamp } = route.params; // Get the timestamp from route params
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollForModel = async () => {
      try {
        const url = `${API_BASE}/storage/outputs/${timestamp}/${timestamp}_model.glb`;
        const { status } = await axios.head(url); // Check if the file exists

        if (status === 200) {
          setModelUrl(url);
          setLoading(false);
        } else {
          throw new Error('Model not available yet.');
        }
      } catch {
        setTimeout(pollForModel, 5000); // Retry every 5 seconds
      }
    };

    pollForModel();
  }, [timestamp]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color="#000" size="large" />
          <Text>Loading your model. Please wait...</Text>
        </View>
      ) : (
        <Canvas style={{ flex: 1 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <GltfModel modelUrl={modelUrl} />
        </Canvas>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});
