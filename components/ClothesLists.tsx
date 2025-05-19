import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Link, } from 'expo-router';
import clothesLists from '@/assets/clothesLists';
import { Card } from '@rneui/base';
import { ClothesList } from './types';

export const defaultErrorImage = 'https://cdn4.iconfinder.com/data/icons/text-editor-2/24/Insert-Image-1024.png';

type ProductListItemProps = {
    clothesList: ClothesList;
  };
const ProductListItem = ({ clothesList }: ProductListItemProps) => {
  return (
        <Link href={ `/clothes/${clothesList.id}` } asChild>
         <Pressable style={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          {/* <Text style={styles.title}>{clothesList.name}</Text> */}
        <Image source={{uri: clothesList.image || defaultErrorImage }} 
        style={ styles.image}
        resizeMode='contain' />
       </Card>
       </Pressable>
       </Link>

  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, 
    alignContent: 'center', 
    width: '98%',
    
  },

  image:{
    aspectRatio: 2/3,
    width: '70%', 
    alignSelf: 'center',
  },
  cardContainer:{
    borderRadius: 10,
    padding:2,
  },

  title: {
    fontSize: 14,
    fontWeight: '800',
    textAlign:'left',
    paddingLeft: 5,
  },
  captitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#10609B',
    paddingLeft: 5, 

  },
  caption:{
    fontSize: 10, 
    flex:1,  
  }, 

  price:{
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 5, 
    marginTop: 5, 
    
  }
  
});