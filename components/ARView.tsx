import ExpoTHREE, { THREE } from 'expo-three';
import Expo from 'expo';
import ExpoGraphics from 'expo-graphics';
import { ScrollView, StyleSheet, Text, View, Image, Button, TextInput, Modal } from 'react-native';
import React from 'react';


export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    onContextCreate = async ({gl, scale, width, height, arSession }) => {
            // Initialize renderer...
    this.renderer = ExpoTHREE.createRenderer({gl});
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);

    // Initialize scene...
    this.scene = new THREE.Scene();
    this.scene.background = ExpoTHREE.createARBackgroundTexture(arSession, this.renderer);

    // Initialize camera...
    this.camera = ExpoTHREE.createARCamera(arSession, width / scale, height / scale, 0.01, 1000);

    // Initialize lighting...
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.scene.add(ambientLight);

    }

    onRender = (delta) => {
    
        // Render...
        this.renderer.render(this.scene, this.camera);
      }


    render (){
        return (
            <ExpoGraphics.View
                style={{ flex: 1 }}
                onContextCreate={this.onContextCreate}
                onRender={this.onRender}
                arEnabled={true}
            />

        )
    }
}