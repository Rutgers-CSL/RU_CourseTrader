import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';


export default function ProfileSearch({ navigation }) {

    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigation.replace("Login");
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.text}>Switch Account:</Text>

                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.iconBar}>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Home')} >
                    <FontAwesome name="home" size={28} color="333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Search')}>
                    <FontAwesome name="plus" size={28} color="333" />
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

    logoutButton: {
      marginTop: 20,
      alignSelf: "center",
      backgroundColor: "#ff4d4d",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3, // Android shadow
    },
    
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
  