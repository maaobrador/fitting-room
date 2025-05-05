import { FlatList, View, Text, Image } from "react-native";
import clothesLists from "@/assets/clothesLists";
import { StyleSheet } from "react-native";
import ProductListItem from "@/components/ClothesLists";


export default function Clothes() {
  return (
    <View style={styles.container}>
      <FlatList
        data={clothesLists}
        renderItem={({ item }) => <ProductListItem clothesList={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
  }
)