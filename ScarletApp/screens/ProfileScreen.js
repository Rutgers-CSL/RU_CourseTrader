import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';

// Constants for calendar layout
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const START_HOUR = 7; 
const HOUR_HEIGHT = 60; 

export default function ProfileSearch({ navigation }) {
    // 1. State Management
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    // Form States
    const [newTitle, setNewTitle] = useState('');
    const [newDay, setNewDay] = useState('Monday');
    const [newCampus, setNewCampus] = useState('');
    const [newStart, setNewStart] = useState('10:00');
    const [newEnd, setNewEnd] = useState('11:20');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const { data: { user} } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('user_courses')
            .select('*')
            .eq('user_id', user.id);
        
        if (error) console.error(error);
        else setCourses(data || []);
        setLoading(false);    
        
    };
 
    // 2. Helper Functions
    const getTopPosition = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') {
            return 0;
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60 + minutes) - (START_HOUR * 60);
    };

    const getHeight = (start, end) => {
        return getTopPosition(end) - getTopPosition(start);
    };

    const getCampusColor = (campusName) => {
        const name = campusName.toLowerCase().trim();
        switch (name) {
            case 'busch': return '#ADD8E6'; // Blue
            case 'livingston': return '#FFD580'; // Orange
            case 'college avenue': return '#FDFD96'; // Yellow
            case 'cook': return '#98FB98'; // Green
            case 'downtown': return '#E6E6FA'; // Purple
            default: return '#D3D3D3'; // Gray
        }
    };

    // 3. Actions
    const addCourse = async () => {
        if (!newTitle || !newCampus) {
            Alert.alert("Missing Info", "Please enter a title and campus.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        const newCourse = {
            user_id: user.id,
            title: newTitle,
            day: newDay,
            start_time: newStart,
            end_time: newEnd,
            campus: newCampus,
            color: getCampusColor(newCampus),
        };

        const { data, error } = await supabase
            .from('user_courses')
            .insert([newCourse])
            .select();

        if (error) {
            Alert.alert("Error", error.message);
        } else if (data && data.length > 0) {
            setCourses((prevCourses) => [...prevCourses, data[0]]);
            setNewTitle('');
            setNewCampus('');
            setIsModalVisible(false);          
        }
    };

    const deleteCourse = (id) => {
        Alert.alert("Delete Class", "Remove this class from your schedule?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                const { error } = await supabase
                    .from('user_courses')
                    .delete()
                    .eq('id', id);
                if (!error){
                    setCourses(courses.filter(c => c.id !== id));
                }
            }}
        ]);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace("Login");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            
            {/* Top Header Buttons */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={handleLogout} style={styles.smallButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setIsModalVisible(true)} 
                    style={[styles.smallButton, { backgroundColor: '#04AA6D' }]}
                >
                    <Text style={styles.buttonText}>+ Add Class</Text>
                </TouchableOpacity>
            </View>

            {/* Manual Entry Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Class</Text>
                        
                        <TextInput 
                            placeholder="Course Title (e.g. CS111)" 
                            style={styles.input}
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />
                        
                        <TextInput 
                            placeholder="Campus (Busch, Livingston...)" 
                            style={styles.input}
                            value={newCampus}
                            onChangeText={setNewCampus}
                        />

                        <View style={styles.timeInputRow}>
                            <TextInput 
                                placeholder="Start (10:00)" 
                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                value={newStart}
                                onChangeText={setNewStart}
                            />
                            <TextInput 
                                placeholder="End (11:20)" 
                                style={[styles.input, { flex: 1 }]}
                                value={newEnd}
                                onChangeText={setNewEnd}
                            />
                        </View>

                        <Text style={styles.label}>Select Day:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker}>
                            {DAYS.map(day => (
                                <TouchableOpacity 
                                    key={day} 
                                    onPress={() => setNewDay(day)}
                                    style={[styles.dayOption, newDay === day && styles.dayOptionSelected]}
                                >
                                    <Text style={newDay === day ? styles.dayTextSelected : styles.dayText}>{day.substring(0,3)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.saveButton} onPress={addCourse}>
                            <Text style={styles.buttonText}>Save to Calendar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.cancelLink}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
                <View style={{ width: 50 }} /> 
                {DAYS.map(day => (
                    <Text key={day} style={styles.dayHeaderText}>{day.substring(0, 3)}</Text>
                ))}
            </View>

            {/* Calendar Grid */}
            <ScrollView style={styles.calendarScroll}>
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

                            {courses.filter(c => c.day === day).map(course => (
                                <TouchableOpacity 
                                    key={course.id} 
                                    onLongPress={() => deleteCourse(course.id)}
                                    style={[
                                        styles.courseBlock, 
                                        { 
                                            backgroundColor: course.color,
                                            top: getTopPosition(course.start_time),
                                            height: getHeight(course.start_time, course.end_time)
                                        }
                                    ]}
                                >
                                    <Text style={styles.courseTitle}>{course.title}</Text>
                                    <Text style={styles.courseCampus}>{course.campus}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Nav Bar */}
            <View style={styles.iconBar}>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome name="home" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Search')}>
                    <FontAwesome name="plus" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink} onPress={() => navigation.navigate('Notifications')}>
                    <FontAwesome name="bell" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLink}>
                    <FontAwesome name="user" size={24} color="#04AA6D" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topControls: { flexDirection: 'row', justifyContent: 'center', gap: 10, padding: 10 },
    smallButton: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 8 },
    buttonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    
    // Modal Styles
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    input: { width: '100%', height: 45, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 12 },
    timeInputRow: { flexDirection: 'row', width: '100%' },
    label: { alignSelf: 'flex-start', fontWeight: 'bold', marginBottom: 5 },
    dayPicker: { flexDirection: 'row', marginBottom: 15 },
    dayOption: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginRight: 5 },
    dayOptionSelected: { backgroundColor: '#04AA6D', borderColor: '#04AA6D' },
    dayText: { fontSize: 12 },
    dayTextSelected: { fontSize: 12, color: 'white', fontWeight: 'bold' },
    saveButton: { backgroundColor: '#04AA6D', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
    cancelLink: { color: 'red', marginTop: 15, fontWeight: '600' },

    // Calendar Header
    calendarHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 5 },
    dayHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555' },
    
    // Grid Layout
    calendarScroll: { flex: 1, marginBottom: 80 },
    gridContainer: { flexDirection: 'row', paddingRight: 10 },
    timeSidebar: { width: 50, borderRightWidth: 1, borderColor: '#eee' },
    hourMarker: { height: HOUR_HEIGHT },
    timeLabel: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: -6 },
    dayColumn: { flex: 1, height: HOUR_HEIGHT * 13, position: 'relative', borderRightWidth: 0.5, borderColor: '#f0f0f0' },
    gridLine: { height: HOUR_HEIGHT, borderBottomWidth: 0.5, borderColor: '#eee' },
    
    // Course Blocks
    courseBlock: { position: 'absolute', left: 2, right: 2, padding: 4, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', zIndex: 5 },
    courseTitle: { fontSize: 9, fontWeight: 'bold', color: '#333' },
    courseCampus: { fontSize: 7, color: '#444' },

    iconBar: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", paddingVertical: 12, position: "absolute", bottom: 15, left: 15, right: 15, borderRadius: 25, elevation: 10, shadowOpacity: 0.15 },
    iconLink: { padding: 8 },
});