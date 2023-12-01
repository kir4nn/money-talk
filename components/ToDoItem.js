import { 
  StyleSheet,
  View,
  Text,
  Pressable
} from "react-native";

function ToDoItem(props){
  return(
      <View style={styles.todoListTexts}>
        <Pressable android_ripple={{color:'#9aa0a6'}}
          onPress={props.onDeleteItem.bind(this, props.id)}
          style={({pressed})=>pressed&&styles.pressedItem}>
          <Text style={styles.todoText}>
              {props.text}
          </Text>
        </Pressable>
      </View>
    
  );
}

export default ToDoItem;

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
  padding:10,
  textAlign:'center',
  fontSize:20
},
pressedItem:{
  opacity:0.5
}
});