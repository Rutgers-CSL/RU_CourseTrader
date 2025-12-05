import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';


export default function HomeScreen({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchMatchingRequests = async () => {

      try {
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        const { data: myRequests } = await supabase
          .from("requests")
          .select("*")
          .eq("user_id", user.id);
        
        if (!myRequests || myRequests.length === 0) {
          setRequests([]);
          setLoading(false);
          return;
        }

        const { data: otherRequests } = await supabase
          .from("requests")
          .select("*")
          .neq("user_id", user.id)

        const results = [];

        for (const mine of myRequests) {
          for (const theirs of otherRequests) {

            if (
              mine.course_name === theirs.course_name &&
              mine.section_have === theirs.section_want &&
              mine.section_want === theirs.section_have
            ) {
              results.push(theirs);
            }
          }
        }

        setRequests(results);
      } catch (err) {
        console.error("Error matching: ", err.message);
      } finally {
        setLoading(false);
      }

    }
    
    useEffect(() => {
      fetchMatchingRequests();
    }, []);

    return(
        <SafeAreaView style={styles.container}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Matching Trades</Text>

            {loading && <Text>Loading...</Text>}

            {!loading && requests.length === 0 && (
              <Text>No matching trade requests found.</Text>
            )}

            {!loading && requests.map((req) => (
              <View key={req.id} style={styles.tradeCard}>
                <Text style={styles.tradeCourse}>{req.course_name}</Text>

                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Providing: </Text>
                  <Text style={styles.tradeValue}>{req.section_have}</Text>
                </View>

                <View style={styles.tradeRow}>
                  <Text style={styles.tradeLabel}>Requesting: </Text>
                  <Text style={styles.tradeValue}>{req.section_want}</Text>
                </View>
                
              </View>
))}

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

    // BLOCK STYLING
    tradeCard: {
      marginTop: 12,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "#f7f7f7",
      borderWidth: 1,
      borderColor: "#ddd",
      // subtle shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      // elevation for Android
      elevation: 2,
    },
    tradeCourse: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },
    tradeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    tradeLabel: {
      fontWeight: "600",
    },
    tradeValue: {
      fontWeight: "400",
    },
    tradeButton: {
      marginTop: 10,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#333",
      alignItems: "center",
    },
    tradeButtonText: {
      fontWeight: "600",
    },

  });
  