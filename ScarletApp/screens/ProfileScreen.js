import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabaseClient';

// these are different constants we need for the calendar, such as days and start times
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const START_HOUR = 7; // this means the calendar starts at 7
const HOUR_HEIGHT = 60; 

export default function ProfileSearch({ navigation }) {
    
  
    //for now, we can use sample courses, such as these, but in the future, we can change it to base it off of users' schdules
    const [courses, setCourses] = useState([
        { id: '1', title: 'CS111', day: 'Monday', start: '10:20', end: '11:40', color: '#FFD580' },
        { id: '2', title: 'Phys 203', day: 'Tuesday', start: '10:20', end: '11:40', color: '#F8C8DC' },
        { id: '3', title: 'CALC151', day: 'Wednesday', start: '14:00', end: '15:20', color: '#FDFD96' },
    ]);

        const getTopPosition = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60 + minutes) - (START_HOUR * 60);
    };

    const getHeight = (start, end) => {
        return getTopPosition(end) - getTopPosition(start);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace("Login");
    };

    const handleDeleteAccount = () => {
        Alert.alert("Delete account data?", "This cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {} }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            
            {/* 2. this is for the logout and delete account functionality */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={handleLogout} style={styles.smallButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteAccount} style={[styles.smallButton, { backgroundColor: '#ccc' }]}>
                    <Text style={styles.buttonText}>Delete Data</Text>
                </TouchableOpacity>
            </View>

            {/* this is for the header for the calendars */}
            <View style={styles.calendarHeader}>
                <View style={{ width: 50 }} /> 
                {DAYS.map(day => (
                    <Text key={day} style={styles.dayHeaderText}>{day.substring(0, 3)}</Text>
                ))}
            </View>

            {/* this is for the calendar grid */}
            <ScrollView style={styles.calendarScroll}>
                <View style={styles.gridContainer}>
                    
                    {/* Time Sidebar */}
                    <View style={styles.timeSidebar}>
                        {Array.from({ length: 13 }).map((_, i) => (
                            <View key={i} style={styles.hourMarker}>
                                <Text style={styles.timeLabel}>{START_HOUR + i}:00</Text>
                            </View>
                        ))}
                    </View>

                    {/* Columns for each day */}
                    {DAYS.map((day) => (
                        <View key={day} style={styles.dayColumn}>
                            {/* Horizontal Grid Lines */}
                            {Array.from({ length: 13 }).map((_, i) => (
                                <View key={i} style={styles.gridLine} />
                            ))}

                            {/* Render Courses for this day */}
                            {courses.filter(c => c.day === day).map(course => (
                                <View key={course.id} style={[
                                    styles.courseBlock, 
                                    { 
                                        backgroundColor: course.color,
                                        top: getTopPosition(course.start),
                                        height: getHeight(course.start, course.end)
                                    }
                                ]}>
                                    <Text style={styles.courseTitle}>{course.title}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* nav bar */}
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
    smallButton: { backgroundColor: '#ff4d4d', padding: 8, borderRadius: 5 },
    buttonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    
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
    courseBlock: {
        position: 'absolute',
        left: 2,
        right: 2,
        padding: 4,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        zIndex: 5,
        overflow: 'hidden'
    },
    courseTitle: { fontSize: 8, fontWeight: 'bold', color: '#333' },

    iconBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 12,
        position: "absolute",
        bottom: 15,
        left: 15,
        right: 15,
        borderRadius: 25,
        elevation: 10,
        shadowOpacity: 0.15,
    },
    iconLink: { padding: 8 },
});