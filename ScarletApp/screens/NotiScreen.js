import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../lib/supabaseClient";

export default function NotiScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({
    course_name: "",
    section_have: "",
    section_want: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchRequests = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        console.warn("No user is logged in");
        return;
      }

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;

      console.log("Fetched requests:", data); // check your data
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Optional: real-time subscription
  }, []);

  // edit/delete popup
  const openActions = (item) => {
    Alert.alert("Trade Request", "What would you like to do?", [
      { text: "Edit", onPress: () => startEdit(item) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(item),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // edit pop-up
  const startEdit = (item) => {
    setEditForm({
      course_name: item.course_name,
      section_have: String(item.section_have ?? ""),
      section_want: String(item.section_want ?? ""),
    });
    setEditingRequest(item);
  };

  // delete confirmation pop-up
  const confirmDelete = (item) => {
    Alert.alert(
      "Delete request",
      "Are you sure you want to delete this trade request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item.id),
        },
      ]
    );
  };

  // save edit (into DB)
  const handleSaveEdit = async () => {
    if (!editingRequest || !editingRequest.id) {
      Alert.alert("Error", "No trade request selected to edit.");
      return;
    }

    if (
      !editForm.course_name ||
      !editForm.section_have ||
      !editForm.section_want
    ) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      setSavingEdit(true);

      const { error } = await supabase
        .from("requests")
        .update({
          course_name: editForm.course_name,
          section_have: editForm.section_have,
          section_want: editForm.section_want,
          user_id: editingRequest.user_id,
        })
        .eq("id", editingRequest.id);

      if (error) {
        console.error("Supabase UPDATE error:", error);
        Alert.alert("Error", error.message);
        return;
      }

      // Refresh list from DB
      await fetchRequests();
      setEditingRequest(null);
    } catch (error) {
      console.error("Update error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // save delete (into DB)
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("requests").delete().eq("id", id);

      if (error) {
        console.error("Supabase DELETE error:", error);
        Alert.alert("Error", error.message);
        return;
      }

      await fetchRequests();
    } catch (error) {
      console.error("Delete error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* edits/delete dots */}
        <Text style={styles.courseName}>{item.course_name}</Text>
        <TouchableOpacity onPress={() => openActions(item)}>
          <FontAwesome name="ellipsis-v" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionText}>
        Section I have: {item.section_have}
      </Text>
      <Text style={styles.sectionText}>
        Section I want: {item.section_want}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* edit request modal */}
      <Modal
        visible={!!editingRequest}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingRequest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Trade Request</Text>

            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={editForm.course_name}
              onChangeText={(text) =>
                setEditForm((f) => ({ ...f, course_name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Section I have"
              value={editForm.section_have}
              onChangeText={(text) =>
                setEditForm((f) => ({ ...f, section_have: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Section I want"
              value={editForm.section_want}
              onChangeText={(text) =>
                setEditForm((f) => ({ ...f, section_want: text }))
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setEditingRequest(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={styles.iconBar}>
        <TouchableOpacity
          style={styles.iconLink}
          onPress={() => navigation.navigate("Home")}
        >
          <FontAwesome name="home" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconLink}
          onPress={() => navigation.navigate("Search")}
        >
          <FontAwesome name="plus" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconLink}
          onPress={() => navigation.navigate("Notifications")}
        >
          <FontAwesome name="bell" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconLink}
          onPress={() => navigation.navigate("Profile")}
        >
          <FontAwesome name="user" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 3,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
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
  // dots
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  // modal styles + input reused in modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalCancelButton: {
    backgroundColor: "#eee",
  },
  modalSaveButton: {
    backgroundColor: "#4B7BE5",
  },
  modalButtonText: {
    fontSize: 16,
  },
});
