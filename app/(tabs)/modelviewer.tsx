import React, { useEffect, useState, Suspense } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';

const API_BASE = Constants.expoConfig?.extra?.API_BASE;


const GltfModel = ({ modelUrl }: { modelUrl: string }) => {
  const model = useGLTF(modelUrl);
  return (
    <group scale={[2, 2, 2]} position={[0, 0, 0]}>
      <primitive object={model.scene} />
    </group>
  );
};

export default function ModelViewer() {
  const { timestamp } = useLocalSearchParams();
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!timestamp) {
      Alert.alert('Error', 'No created model');
      return;
    }


    const pollForModel = async () => {
      try {
        const url = `${API_BASE}/storage/outputs/${timestamp}/${timestamp}_model.glb`;
        console.log('Attempting to access URL:', url);

        try {
          const { status } = await axios.head(url);
          if (status === 200) {
            setModelUrl(url);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn(`URL not found: ${url}`);
        }

        throw new Error('Model not available yet.');
      } catch (error) {
        console.warn('Polling failed, retrying...', error.message);
        setTimeout(pollForModel, 5000);
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
      ) : modelUrl ? (
        <Suspense fallback={
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#000" />
            <Text>Loading model...</Text>
          </View>
        }>
          <Canvas style={{ flex: 1 }} camera={{ position: [0, 1.5, 5], fov: 30 }}>
            <color attach="background" args={['#fff']} />
            <ambientLight intensity={1} />
            <directionalLight position={[0, 0, 10]} intensity={1.5} />
            <GltfModel modelUrl={modelUrl} />
            <OrbitControls />
          </Canvas>
        </Suspense>
      ) : (
        <Text style={styles.errorText}>Failed to load the model. Please try again later.</Text>
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
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});
