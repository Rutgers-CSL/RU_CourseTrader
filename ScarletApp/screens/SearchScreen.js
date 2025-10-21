import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SearchScreen({ navigation }) {

  const [formData, setFormData ] = useState({
    courseName: '',
    sectionHave: '',
    sectionWant: '',
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    Alert.alert(
      'Form Submitted', 
      'You entered:\n\ Course Name: $(formData.courseName}\n Section You Have: ${formData.sectionHave}\nSection You Want: ${formData.sectionWant}',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    setFormData({
      courseName: '',
      sectionHave: '',
      sectionWant: '',
    });
  };
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.text}>This is the Create Trade Request!</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value = {formData.courseName}
              onChangeText={(text) => handleChange('courseName', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Section I have"
              value = {formData.sectionHave}
              onChangeText={(text) => handleChange('sectionHave', text)}
            />  

            <TextInput
              style={styles.input}
              placeholder="Section I want"
              value = {formData.sectionWant}
              onChangeText={(text) => handleChange('sectionWant', text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Trade Request</Text>
            </TouchableOpacity>


            <View style={styles.iconBar}>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Home')} >
                    <FontAwesome name="home" size={28} color="333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Search')}>
                    <FontAwesome name="search" size={28} color="333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Notifications')}>
                    <FontAwesome name="bell" size={28} color="333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Profile')}>
                    <FontAwesome name="user" size={28} color="333" />
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingBottom: 100,
    },

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },

    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      fontSize: 16,
    },

    button: {
      backgroundColor: '#4B7BE5',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },

    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  
    text: {
      fontSize: 18,
      fontWeight: '500',
      color: 'black',
      textAlign: 'center',
    },
  
    iconBar: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#fff",
      paddingVertical: 12,
      paddingHorizontal: 10,  
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
  
    iconLink: {
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
    },
  
    iconLinkHover: {
      backgroundColor: "#000",
    },
  
    active: {
      backgroundColor: "#04AA6D",
    },
  
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 80,
      backgroundColor: '#e0f7fa',
    },
  });
  