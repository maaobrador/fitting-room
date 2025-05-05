import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Card } from "@rneui/base";
import clothesLists from "@/assets/clothesLists";
import { defaultErrorImage } from "@/components/ClothesLists";
import { Button } from "@rneui/base";


async function handleAR () {
//logic for trying on clothes using AR
      console.log('AR button pressed');
    }

    async function handleAvatar () {
//logic for trying on clothes using Avatar
        console.log('Avatar button pressed');
      }


const ClothesScreen = () => {
    const { id } = useLocalSearchParams();

    const clothes = clothesLists.find((p) => p.id.toString() === id);
    if (!clothes) {
        return (
            <View style={styles.container}>
                <Text>Clothes not found</Text>
            </View>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <Card containerStyle={styles.cardContainer}>
                <Image source={{ uri: clothes.image || defaultErrorImage }}
                    style={styles.image}
                    resizeMode='contain' />
                
                    <Button
                            title="AR Try On"
                            buttonStyle={{
                              backgroundColor: '#10609B',
                              borderRadius: 10,
                            }}
                            titleStyle={{ fontWeight: '500', fontSize: 18 }}
                            containerStyle={{
                              height: 50,
                              width: 250,
                              alignSelf: 'center',
                            }}
                            onPress={() =>{ handleAR ()}}
                          />
                    
                    <Button
                            title="Avatar Try On"
                            buttonStyle={{
                              backgroundColor: '#10609B',
                              borderRadius: 10,
                            }}
                            titleStyle={{ fontWeight: '500', fontSize: 18 }}
                            containerStyle={{
                              height: 50,
                              width: 250,
                              alignSelf: 'center',
                            }}
                            onPress={() =>{ handleAvatar ()}}
                          />
            </Card>
        </SafeAreaView>
    );
};

export default ClothesScreen;

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        cardContainer: {
            borderRadius: 10,
            alignContent: 'center',
            height: '95%',
            padding: 10,
        },
        image: {
            aspectRatio: 2 / 3,
            width: '85%',
            alignSelf: 'center',
            marginBottom: 10,
        },
    }
)