import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
    const handleLogin = () => {
        navigation.replace('Home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login!</Text>
            </TouchableOpacity>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 40,
      color: '#333',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      marginBottom: 20,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#04AA6D',
      padding: 15,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
  });