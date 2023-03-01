import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Player from './components/Player';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Player />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
