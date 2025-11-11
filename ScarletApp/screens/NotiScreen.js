import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';

export default function NotiScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*');
      if (error) throw error;

      console.log('Fetched requests:', data); // check your data
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Optional: real-time subscription

  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.courseName}>{item.course_name}</Text>
      <Text style={styles.sectionText}>Section I have: {item.section_have}</Text>
      <Text style={styles.sectionText}>Section I want: {item.section_want}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Trade Requests</Text>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4B7BE5" />
        </View>
      ) : requests.length === 0 ? (
        <Text style={styles.emptyText}>No trade requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={styles.iconBar}>
        <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Search')}>
          <FontAwesome name="plus" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Notifications')}>
          <FontAwesome name="bell" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 3,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  iconLink: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
