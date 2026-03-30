import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';


export default function HomeScreen({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewCourses, setPreviewCourses] = useState([]);
    

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const START_HOUR = 7; 

    const getTopPosition = (timeStr) => {
      if (!timeStr || typeof timeStr !== 'string') return 0;
    
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
    
      const position = (hours * 60 + minutes) - (START_HOUR * 60);
      return position;
    };

    const getHeight = (start, end) => {
        return getTopPosition(end) - getTopPosition(start);
    };

    useEffect(() => {
      fetchMatchingRequests();
    }, []);

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

    const handlePreviewTrade = async (tradeRequest) => {
      try {
          // Clear previous preview first to force a UI reset
          setPreviewCourses([]); 
          
          const { data: { user } } = await supabase.auth.getUser();
          
          const { data: currentClasses } = await supabase
              .from('user_courses')
              .select('*')
              .eq('user_id', user.id);
  
          const { data: newSectionBlocks } = await supabase
              .from('user_courses')
              .select('*')
              .eq('title', tradeRequest.course_name)
              .eq('section', tradeRequest.section_have);
  
          // Remove OLD course completely
          const filteredCurrent = currentClasses.filter(c => 
              c.title.toLowerCase().trim() !== tradeRequest.course_name.toLowerCase().trim()
          );
  
          // Merge and set
          const finalSchedule = [...filteredCurrent, ...newSectionBlocks];
          
          console.log("Final Preview Array IDs:", finalSchedule.map(c => c.id));
          
          setPreviewCourses(finalSchedule);
          setPreviewVisible(true);
          
      } catch (err) {
          console.error("Preview error:", err);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Matching Trades</Text>

          {loading && <Text>Loading matches...</Text>}

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

              <TouchableOpacity 
                style={styles.tradeButton} 
                onPress={() => handlePreviewTrade(req)}
              >
                <Text style={styles.tradeButtonText}>Preview New Schedule</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* PREVIEW MODAL */}
        <Modal visible={previewVisible} animationType="slide">
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.previewHeader}>
                <Text style={styles.modalTitle}>Schedule Preview</Text>
                <TouchableOpacity onPress={() => setPreviewVisible(false)} style={{ padding: 10 }}>
                    <FontAwesome name="close" size={24} color="red" />
                </TouchableOpacity>
            </View>
            
            <Text style={styles.previewSub}>
              Previewing: {previewCourses.length > 0 ? previewCourses[0].title : ''}
            </Text>

            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <View style={{ width: 50 }} /> 
              {DAYS.map(day => (
                  <Text key={day} style={styles.dayHeaderText}>{day.substring(0, 3)}</Text>
              ))}
            </View>

            <ScrollView>
              <View style={styles.gridContainer}>
                  <View style={styles.timeSidebar}>
                      {Array.from({ length: 13 }).map((_, i) => (
                          <View key={i} style={styles.hourMarker}>
                              <Text style={styles.timeLabel}>{START_HOUR + i}:00</Text>
                          </View>
                      ))}
                  </View>

                  {DAYS.map((day) => (
                      <View key={day} style={styles.dayColumn}>
                          {Array.from({ length: 13 }).map((_, i) => (
                              <View key={i} style={styles.gridLine} />
                          ))}

                          {/* Corrected: Mapping over previewCourses */}
                          {previewCourses.filter(c => c.day === day).map((course, index) => (
                            <View 
                                // We combine course.id with index to ensure the key is 100% unique
                                key={`${course.id}-${index}`} 
                                style={[
                                    styles.courseBlock, 
                                    { 
                                        backgroundColor: course.color || '#D3D3D3',
                                        top: getTopPosition(course.start_time),
                                        height: getHeight(course.start_time, course.end_time)
                                    }
                                ]}
                            >
                                <Text style={styles.courseTitle}>{course.title}</Text>
                                <Text style={styles.courseCampus}>{course.section}</Text>
                            </View>
                        ))}
                      </View>
                  ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.saveButton, { margin: 20 }]} 
              onPress={() => setPreviewVisible(false)}
            >
              <Text style={styles.buttonText}>Close Preview</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Footer Icon Bar */}
        <View style={styles.iconBar}>
            <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Home')} >
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
        <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tradeCard: { marginVertical: 8, padding: 16, borderRadius: 12, backgroundColor: "#f7f7f7", borderWidth: 1, borderColor: "#ddd" },
  tradeCourse: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  tradeRow: { flexDirection: "row", marginBottom: 4 },
  tradeLabel: { fontWeight: "600" },
  tradeButton: { marginTop: 10, paddingVertical: 10, borderRadius: 8, backgroundColor: "#04AA6D", alignItems: "center" },
  tradeButtonText: { color: "#fff", fontWeight: "600" },
  
  // Preview Modal Styles
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  previewSub: { paddingHorizontal: 20, color: '#666', marginBottom: 10 },
  saveButton: { backgroundColor: '#04AA6D', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  // Calendar Grid Styles
  calendarHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 5 },
  dayHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  gridContainer: { flexDirection: 'row', paddingRight: 10 },
  timeSidebar: { width: 50, borderRightWidth: 1, borderColor: '#eee' },
  hourMarker: { height: 60 },
  timeLabel: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: -6 },
  dayColumn: { flex: 1, height: 60 * 13, position: 'relative', borderRightWidth: 0.5, borderColor: '#f0f0f0' },
  gridLine: { height: 60, borderBottomWidth: 0.5, borderColor: '#eee' },
  courseBlock: { position: 'absolute', left: 2, right: 2, padding: 4, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  courseTitle: { fontSize: 8, fontWeight: 'bold' },
  courseCampus: { fontSize: 7 },

  iconBar: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", paddingVertical: 12, position: "absolute", bottom: 10, left: 10, right: 10, borderRadius: 20, elevation: 6, shadowOpacity: 0.1 },
  iconLink: { padding: 8 },
  });
  