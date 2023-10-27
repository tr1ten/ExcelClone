import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Grid from "./components/Grid";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
    marginBottom: 20, // Add spacing below the heading
  },
});
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Excel Clone by Kamal</Text>
      <Grid></Grid>
      <StatusBar style="auto" />
    </View>
  );
}


