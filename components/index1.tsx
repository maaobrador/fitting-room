import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, ActivityIndicator, View, Text, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import JSZip from 'jszip';

import ImageCard from '@/components/ImageCard';
import ImageNamingModal from '@/components/ImageNamingModal';
import ActionButtons from '@/components/ActionButtons';
import { imgDir, ensureDirExists, checkFileSize } from '@/components/fileHelper';

const API_BASE = 'http://192.168.168.207:8000';

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    setImages(files.map((f) => imgDir + f));
  };

  const selectImage = async (useLibrary: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    };

    const result = useLibrary
      ? await ImagePicker.launchImageLibraryAsync(options)
      : await ImagePicker.launchCameraAsync(options);

    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
      setIsNaming(true);
    }
  };

  const handleSaveWithName = async () => {
    if (!newImageUri || !newFileName.trim()) return;

    const ext = newImageUri.split('.').pop() || 'jpg';
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

  const uploadImage = async (uri: string) => {
    const canUpload = await checkFileSize(uri);
    if (!canUpload) return alert('File too large');

    const cleanUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
    const filename = uri.split('/').pop()!;
    const ext = filename.split('.').pop();
    const type = `image/${ext}`;

    const formData = new FormData();
    formData.append('image', { uri: cleanUri, name: filename, type } as any);
    formData.append('timestamp', new Date().toISOString());

    try {
      setUploading(true);
      const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data.isSuccess) return alert('Upload failed');
      alert('Image Uploaded');
    } catch {
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const uploadImagesBatch = async () => {
    try {
      setUploading(true);

      const zip = new JSZip();

      for (let uri of images) {
        const filename = uri.split('/').pop()!;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        zip.file(filename, base64, { base64: true });
      }

      const zipBase64 = await zip.generateAsync({ type: 'base64' });

      const zipPath = FileSystem.cacheDirectory + 'images.zip';
      await FileSystem.writeAsStringAsync(zipPath, zipBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const cleanZipUri = Platform.OS === 'android' ? zipPath : zipPath.replace('file://', '');

      const formData = new FormData();
      formData.append('zipfile', {
        uri: cleanZipUri,
        name: 'images.zip',
        type: 'application/zip',
      } as any);
      formData.append('timestamp', new Date().toISOString());

      const { data } = await axios.post(`${API_BASE}/api/upload-zip`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(data.isSuccess ? 'ZIP Upload successful!' : 'ZIP Upload failed');
    } catch (err) {
      console.error(err);
      alert('Zip upload failed.');
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
      <Text style={styles.title}>Images</Text>

      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ImageCard
            uri={item}
            onUpload={() => uploadImage(item)}
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
        hasImages={images.length > 0}
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
  title: { textAlign: 'center', fontSize: 18, fontWeight: '500', marginTop: 20 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
