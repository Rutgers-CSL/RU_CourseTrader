import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons';

export default function App() {

  return (
    <View style={styles.container}>
      <View style={styles.iconBar}>
        <TouchableOpacity style={[styles.iconLink, styles.active]}>
          <FontAwesome name="home" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="search" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="globe" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="trash" size={36} color="white" />
        </TouchableOpacity>
      </View>

      <Text>This is the beginning of the RU_CourseTrader App!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  iconBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 5,  
  },

  iconLink: {
    padding: 8,
    alignItems: "center",
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
  }
});
