import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';

type Props = {
  visible: boolean;
  fileName: string;
  onChangeFileName: (name: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

const ImageNamingModal = ({ visible, fileName, onChangeFileName, onCancel, onSave }: Props) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Enter File Name</Text>
        <Text style={{ fontSize: 10, marginBottom: 5 }}>
          Name the photo front or side
        </Text>
        <TextInput
          style={styles.input}
          placeholder="front.jpg"
          value={fileName}
          onChangeText={onChangeFileName}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Cancel" onPress={onCancel} />
          <Button title="Save" onPress={onSave} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ImageNamingModal;
