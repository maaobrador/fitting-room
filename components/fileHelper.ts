import * as FileSystem from 'expo-file-system';

export const imgDir = FileSystem.documentDirectory + 'images/';

export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export const checkFileSize = async (uri: string) => {
  const info = await FileSystem.getInfoAsync(uri);
  return info.size && info.size <= 2 * 1024 * 1024; // 2MB
};
