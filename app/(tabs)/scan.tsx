import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@rneui/base';
import { Button } from '@rneui/base';

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};



export default function App() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);

  // Load images on startup
  useEffect(() => {
    loadImages();
  }, []);

  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

  // Select image from library or camera
  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled) {
      saveImage(result.assets[0].uri)
      console.log(result.assets[0].uri);
    }
  };

  // Save image to file system
  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const filename = new Date().getTime() + '.jpeg';
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };



  // Render image list item
  const renderItem = ({ item }: { item: any }) => {
    const filename = item.split('/').pop();
    return (
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' ,}}>
          <Image style={{
            resizeMode: 'contain',
            width: '50%',
            height: 100
          }}
            source={{ uri: item }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

            <Ionicons.Button
              name="cloud-upload"
              backgroundColor={'#10609B'}
              width={50}
              justifyContent='center'
              onPress={() => uploadImage(item)}
            />
            <Ionicons.Button
              name="trash"
              backgroundColor={'#10609B'}
              width={50}
              justifyContent='center'
              onPress={() => deleteImage(item)} />
          </View>

        </View>
      </Card>

    );
  };

  // Upload image to server
  const uploadImage = async (uri: string) => {
    setUploading(true);
    console.log('Uploading image...');
    await FileSystem.uploadAsync('http://192.168.168.207/projectsample/upload.php', uri, {
      //change to localhost ip
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file'
    }
  );
  console.log('Image uploaded');
    setUploading(false);
  };

  // Delete image from file system
  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };


  return (
    <SafeAreaView style={styles.container}>


      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', marginTop: 15 }}> Images</Text>

      <FlatList data={images}
        renderItem={renderItem} />

      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Photo Library"
          buttonStyle={{
            backgroundColor: '#10609B',
          }}
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={{
            height: 50,
            width: "45%",
            alignSelf: 'center',
            marginVertical: 5
          }}
          onPress={() => { selectImage(true) }}
        />

        <Button
          title="Camera"
          buttonStyle={{
            backgroundColor: '#10609B',

          }}
          titleStyle={{ fontWeight: '500', fontSize: 15 }}
          containerStyle={{
            height: 50,
            width: "45%",
            alignSelf: 'center',
            marginVertical: 5
          }}
          onPress={() => { selectImage(false) }}
        />
      </View>
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
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10
  },
  button: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});