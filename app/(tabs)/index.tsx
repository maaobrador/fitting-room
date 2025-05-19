import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import ImageCard from '@/components/ImageCard';
import ImageNamingModal from '@/components/ImageNamingModal';
import ActionButtons from '@/components/ActionButtons';
import { imgDir, ensureDirExists } from '@/components/fileHelper';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';

const API_BASE = Constants.expoConfig?.extra?.API_BASE;

export default function App() {
  <Stack.Screen
    options={{
      title: "Images"
    }}
  />
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    setImages(files.map((f) => imgDir + f));
  };

  const selectImage = async (useLibrary: boolean) => {
    if (images.length >= 2) {
      alert('You can only add up to 2 images.');
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    };

    const result = useLibrary
      ? await ImagePicker.launchImageLibraryAsync(options)
      : await ImagePicker.launchCameraAsync(options);

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { format: ImageManipulator.SaveFormat.PNG }
      );

      setNewImageUri(manipulated.uri);
      setIsNaming(true);
    }
  };

  const handleSaveWithName = async () => {
    if (!newImageUri || !newFileName.trim()) return;

    const ext = 'png';
    const filename = newFileName.trim().endsWith(`.${ext}`)
      ? newFileName.trim()
      : `${newFileName.trim()}.${ext}`;

    const dest = imgDir + filename;

    try {
      await FileSystem.copyAsync({ from: newImageUri, to: dest });
      setImages([...images, dest]);
      setNewImageUri(null);
      setNewFileName('');
      setIsNaming(false);
    } catch {
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const uploadImagesBatch = async () => {
    if (images.length !== 2) {
      alert('You must upload exactly 2 images.');
      return;
    }

    if (!height.trim()) {
      alert('Please enter height before uploading.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      images.forEach((uri, index) => {
        const cleanUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
        formData.append(`image${index + 1}`, {
          uri: cleanUri,
          name: `image${index + 1}.png`,
          type: 'image/png',
        } as any);
      });

      formData.append('height', height);
      formData.append('timestamp', new Date().toISOString());

      const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(data.isSuccess ? 'Upload successful!' : 'Upload failed');
    } catch (err) {
      console.error('❌ Upload error:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.label}>Enter Height (in cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g., 170"
        value={height}
        onChangeText={setHeight}
      />
      
      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ImageCard
            uri={item}
            onDelete={() => deleteImage(item)}
            uploading={uploading}
          />
        )}
      />

      {uploading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}

      <ActionButtons
        onPickFromLibrary={() => selectImage(true)}
        onTakePhoto={() => selectImage(false)}
        onUploadAll={uploadImagesBatch}
        uploading={uploading}
        hasImages={images.length === 2}
      />

      <ImageNamingModal
        visible={isNaming}
        fileName={newFileName}
        onChangeFileName={setNewFileName}
        onCancel={() => setIsNaming(false)}
        onSave={handleSaveWithName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    padding: 10,
  },
  label: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
