import React, { useState, useEffect } from 'react';
import { Image,View, StyleSheet, ActivityIndicator, SafeAreaView, Text, FlatList, Alert, TextInput, Platform,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '@rneui/base';
import axios from 'axios';

const API_BASE = 'http://192.168.168.207/projectsample'; // Replace with your local IP
const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

  const checkFileSize = async (uri: string) => {
    const info = await FileSystem.getInfoAsync(uri);
    return info.size && info.size <= 2 * 1024 * 1024; // 2MB
  };

  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setNewImageUri(imageUri);
      setIsNaming(true); // prompt for filename
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
      setSelectedImage({ uri: dest }); // store for upload
      setNewFileName('');
      setNewImageUri(null);
      setIsNaming(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const uploadImage = async (uri: string) => {
    console.log('Uploading image:', uri);
    if (!uri) return;
    const canUpload = await checkFileSize(uri);
    if (!canUpload) {
      alert('Cannot upload files larger than 2MB');
      return;
    }

    const cleanUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1];
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('image', {
      uri: cleanUri,
      name: filename,
      type,
    } as any);
    formData.append('timestamp', new Date().toISOString());

    try {
      setUploading(true);
      const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data.isSuccess) {
        alert('Image upload failed!');
        return;
      }

      alert('Image Uploaded');
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  const renderItem = ({ item }: { item: string }) => {
    const filename = item.split('/').pop();
    return (
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            style={{ resizeMode: 'contain', width: '50%', height: 100 }}
            source={{ uri: item }}
          />
          <Ionicons.Button
            name="cloud-upload"
            backgroundColor={'#10609B'}
            justifyContent="center"
            onPress={() => uploadImage(item)}
          />
          <Ionicons.Button
            name="trash"
            backgroundColor={'#10609B'}
            justifyContent="center"
            onPress={() => deleteImage(item)}
          />
        </View>
        <Text>{filename}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', marginTop: 20 }}>
        Images
      </Text>

      <FlatList data={images} renderItem={renderItem} />

      {uploading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Photo Library"
          buttonStyle={{ backgroundColor: '#10609B' }}
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={{ height: 50, width: '45%', marginVertical: 5 }}
          onPress={() => selectImage(true)}
        />
        <Button
          title="Camera"
          buttonStyle={{ backgroundColor: '#10609B' }}
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={{ height: 50, width: '45%', marginVertical: 5 }}
          onPress={() => selectImage(false)}
        />
      </View>

      {isNaming && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter File Name</Text>
            <Text style={{fontSize: 10, marginBottom: 5}}>Please name the files based on the angle of the photo you're capturing, such as 'front', 'back', 'left', etc.</Text>
            <TextInput
              style={styles.input}
              placeholder="front.jpg"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancel" onPress={() => setIsNaming(false)} />
              <Button title="Save" onPress={handleSaveWithName} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
});
