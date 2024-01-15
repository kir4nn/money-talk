import { 
    StyleSheet,
    View,
    Text,
    Pressable
  } from "react-native";
import { Ionicons } from '@expo/vector-icons';
function HistoryItem(props){

    return(
        <View style={styles.historyListTexts}>
            <Text style={styles.historyText}>
                {props.action === "add" ? (
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                ) : (
                    <Ionicons name="remove-circle-outline" size={24} color="white" />
                )}
                <Text style={styles.historyText}>
                    {props.text}
                </Text>
            </Text>
            
            <Text style={styles.dateText}>{props.date}</Text>
        </View>
      
    );
}
  
export default HistoryItem;
  
const styles=StyleSheet.create({
 historyListTexts:{
    flex:1,
    color:"white",
    margin:8,
    borderRadius:8,
    overflow:'hidden',
    marginHorizontal:40,
    backgroundColor:"#3c4043",
 },
  historyText:{
    color:"white",
    padding:5,
    fontSize:20,
  },
  dateText: {
    color: "#9aa0a6",
    textAlign: "right",
    paddingRight: 10,
    paddingBottom: 2,
  },
  });