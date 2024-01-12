import { 
    StyleSheet,
    View,
    Text,
    Pressable
  } from "react-native";
import moment from "moment";

function SpentItem(props){

    return(
        <View style={styles.todoListTexts}>
          <Pressable android_ripple={{color:'#9aa0a6'}}
            onPress={props.onDeleteItem.bind(this, props.id)}
            style={({pressed})=>pressed&&styles.pressedItem}>
            <Text style={styles.todoText}>
                {props.text}
            </Text>
            <Text style={styles.dateText}>{props.date}</Text>
          </Pressable>
          
        </View>
      
    );
}
  
  export default SpentItem;
  
  const styles=StyleSheet.create({
  todoListTexts:{
    color:"white",
    margin:8,
    borderRadius:8,
    overflow:'hidden',
    marginHorizontal:40,
    backgroundColor:"#3c4043",
  },
  todoText:{
    color:"white",
    padding:5,
    textAlign:'center',
    fontSize:20
  },
  pressedItem:{
    opacity:0.5
  },
  dateText: {
    color: "#9aa0a6",
    textAlign: "right",
    paddingRight: 10,
    paddingBottom: 2,
  },
  });