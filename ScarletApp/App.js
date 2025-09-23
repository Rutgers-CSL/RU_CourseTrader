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
          <FontAwesome name="home" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="search" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="bell" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLink}>
          <FontAwesome name="user" size={36} color="white" />
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

  iconBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 5,  
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 60,
  }
});
