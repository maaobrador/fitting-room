import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setErrors({});

        try {
            const response = await axios.post('https://your-api-url.com/api/auth/register', formData);
            Alert.alert('Success', 'Registration successful!');
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Alert.alert('Error', 'An error occurred. Please try again later.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={[styles.input, errors.name ? styles.inputError : null]}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input, errors.password ? styles.inputError : null]}
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={formData.password_confirmation}
                    onChangeText={(value) => handleInputChange('password_confirmation', value)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
