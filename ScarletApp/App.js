import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function App() {

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <View style={styles.content}>
        <Text>This is the beginning of the RU_CourseTrader App!</Text>
      </View>

      <View style={styles.iconBar}>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="home" size={28} color="333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="search" size={28} color="333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="bell" size={28} color="333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="user" size={28} color="333" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    fontSize: 18,
    fontWeight: '500',
    text: '#fff'
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
    backgroundColor: '#e0f7fa'
  },
});
