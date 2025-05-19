import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Card } from '@rneui/base';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  uri: string;
  onDelete: () => void;
  uploading: boolean;
};

const ImageCard = ({ uri, onDelete }: Props) => {
  const filename = uri.split('/').pop();

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Image style={styles.image} source={{ uri }} />
          <Text style={styles.text}>{filename}</Text>
        </View>

        <View style={styles.rightSection}>
          <Ionicons.Button
            name="trash"
            backgroundColor="#dc3545"
            onPress={onDelete}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  image: {
    resizeMode: 'contain',
    width: '40%',
    height: 80,
  },
  text: {
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default ImageCard;
