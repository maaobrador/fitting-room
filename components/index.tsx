import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, ActivityIndicator, View, Text, TextInput, Platform, Alert,} from 'react-native';
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
  
    // Check file size
    const fileInfo = await FileSystem.getInfoAsync(newImageUri);
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  
    if (fileInfo.size && fileInfo.size > MAX_SIZE_BYTES) {
      Alert.alert(
        'Image too large',
        `Each image must be under ${MAX_SIZE_MB} MB. Current size: ${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`
      );
      return;
    }
  
    // Ensure the user names the image 'front.png' or 'side.png'
    const ext = 'png';
    let filename = newFileName.trim();
  
    if (!filename.endsWith(`.${ext}`)) {
      filename = `${filename.trim()}.${ext}`;
    }
  
    // Check if it is 'front' or 'side' image
    const isFront = filename.toLowerCase().includes('front');
    const isSide = filename.toLowerCase().includes('side');
  
    if (!isFront && !isSide) {
      Alert.alert('Error', 'Image should be named as "front" or "side".');
      return;
    }
  
    const dest = imgDir + filename;
  
    try {
      await FileSystem.copyAsync({ from: newImageUri, to: dest });
      setImages((prevImages) => [...prevImages, dest]); // Store the image path
      setNewImageUri(null);
      setNewFileName('');
      setIsNaming(false);
    } catch {
      Alert.alert('Error', 'Failed to save image.');
    }
  };
  

  const uploadImagesBatch = async () => {
    // Ensure exactly 2 images are uploaded, and they should be named "front" and "side"
    if (images.length !== 2) {
      alert('You must upload exactly 2 images.');
      return;
    }
  
    const frontImage = images.find((image) => image.toLowerCase().includes('front'));
    const sideImage = images.find((image) => image.toLowerCase().includes('side'));
  
    if (!frontImage || !sideImage) {
      alert('Please ensure you have both "front" and "side" images.');
      return;
    }
  
    if (!height.trim()) {
      alert('Please enter height before uploading.');
      return;
    }
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      
      // Add front and side images with proper field names
      formData.append('front', {
        uri: Platform.OS === 'android' ? frontImage : frontImage.replace('file://', ''),
        name: 'front.png',
        type: 'image/png',
      });
  
      formData.append('side', {
        uri: Platform.OS === 'android' ? sideImage : sideImage.replace('file://', ''),
        name: 'side.png',
        type: 'image/png',
      });
  
      // Add height and timestamp
      formData.append('height', height);
      formData.append('timestamp', new Date().toISOString());

      console.log('📤 Uploading the following FormData:');
      console.log({
        front: frontImage,
        side: sideImage,
        height: Number(height),
        timestamp: new Date().toISOString(),
      });

  
      const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
