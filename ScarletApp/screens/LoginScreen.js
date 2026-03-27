import React, {useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) Alert.alert('Login failed', error.message);
        else navigation.replace('Home');
    };
    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Enter your email', 'Please enter your email address first.');
            return;
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'courseswapper://reset-password' 
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Check your email', 'We sent you a password reset link!');
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login!</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.link}>Create an account</Text>
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
    link: {
    marginTop: 20,
    fontSize: 16,
    color: '#04AA6D',
    fontWeight: '600',
  },
  });