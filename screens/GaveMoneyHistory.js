import {
    StyleSheet,
    Text,
    View,
    FlatList,
    SafeAreaView
  } from 'react-native';
import { useGaveHistory } from '../components/GaveHistoryContext';
import HistoryItem from '../components/HistoryItem';

function GaveMoneyHistory() {
    const { gaveHistory } = useGaveHistory();
  
    return (
      <SafeAreaView style={styles.rootContainer}>
        <View>
            <Text style={styles.screenNameContainer}>History</Text>
        </View>
        <FlatList
          data={gaveHistory.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(itemData) => (
            <HistoryItem
                action={itemData.item.action} // Pass the 'action' prop
                text={itemData.item.item.text} // Pass the 'text' prop
                date={itemData.item.item.date}
            />
          )}
        />
      </SafeAreaView>
    );
  }


export default GaveMoneyHistory;

const styles=StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    screenNameContainer: {
        color: 'white',
        fontSize: 35,
        fontFamily: 'CormorantGaramond-Bold',
        borderBottomWidth:1,
        borderColor:'white',
        paddingLeft:10,
        paddingTop:6,
      },
    });