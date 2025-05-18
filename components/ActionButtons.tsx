import React from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/base';

type Props = {
  onPickFromLibrary: () => void;
  onTakePhoto: () => void;
  onUploadAll: () => void;
  uploading: boolean;
  hasImages: boolean;
};

const ActionButtons = ({
  onPickFromLibrary,
  onTakePhoto,
  onUploadAll,
  uploading,
  hasImages,
}: Props) => (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
      <Button
        title="Photo Library"
        buttonStyle={{ backgroundColor: '#10609B' }}
        titleStyle={{ fontWeight: '500', fontSize: 15 }}
        containerStyle={{ height: 50, width: '45%', marginVertical: 5 }}
        onPress={onPickFromLibrary}
      />
      <Button
        title="Camera"
        buttonStyle={{ backgroundColor: '#10609B' }}
        titleStyle={{ fontWeight: '500', fontSize: 15 }}
        containerStyle={{ height: 50, width: '45%', marginVertical: 5 }}
        onPress={onTakePhoto}
      />
    </View>

    <Button
      title="Upload All Images"
      buttonStyle={{ backgroundColor: '#28A745' }}
      titleStyle={{ fontWeight: '500', fontSize: 15 }}
      containerStyle={{ marginHorizontal: 20, marginBottom: 10 }}
      onPress={onUploadAll}
      disabled={uploading || !hasImages}
    />
  </>
);

export default ActionButtons;