import React, { 
  useState,
  useEffect
} from "react";
import { 
  StyleSheet, 
  Pressable, 
  View, 
  TextInput, 
  Text,
 } from "react-native";
import { useFonts } from "expo-font";
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'dad', value: 'dad' },
  { label: 'mom', value: 'mom' },
  { label: 'bro', value: 'bro' },
  { label: 'sis', value: 'sis' },
  { label: 'others', value: 'others' },
];

const DropdownComponent = ({ onSelectRecipient}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);


  return (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'white' }]}
        placeholder="to"
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemContainerStyle={styles.itemContainerStyle}
        itemTextStyle={styles.listTextStyle}
        containerStyle={styles.listContainerStyle}
        

        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onSelectRecipient(item.value);
        }}
      />
    </View>
  );

}

function ToDoInput(props) {
  const [enteredToDoText, setEnteredToDoText] = useState("");
  const [enteredMoney, setEnteredMoney] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [totalMoney, setTotalMoney]=useState(0);

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf')
  });

  function todoInputHandler(enteredText) {
    setEnteredToDoText(enteredText);
  }

  function moneyInputHandler(enteredText) {
    setEnteredMoney(enteredText);
    const money=parseInt(enteredText)+parseInt(totalMoney);
    setTotalMoney(money);
  }


  function addToDoHandler() {
    props.onAddToDo(enteredToDoText, enteredMoney, selectedRecipient);
    setEnteredToDoText('');
    setEnteredMoney('');
  }

  useEffect(() => {
    // Update local total money whenever the parent component updates it
    setTotalMoney(props.totalMoney);
  }, [props.totalMoney]);

  if (!fontsLoaded) {
    return null; // Return null or a loading indicator while fonts are loading
  }

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.numInput}
          placeholder="₹"
          placeholderTextColor="white"
          color="white"
          onChangeText={moneyInputHandler}
          value={enteredMoney}
          maxLength={4} 
          keyboardType="number-pad" 
        />

        <DropdownComponent 
          onSelectRecipient={setSelectedRecipient} 
          />

        <TextInput
          style={styles.descriptionInput}
          placeholder="description"
          placeholderTextColor="white"
          color="white"
          onChangeText={todoInputHandler}
          value={enteredToDoText}
        />
      </View>
      <View style={styles.buttonView}>
        <Pressable
          android_ripple={{ color: '#9aa0a6' }}
          style={styles.button}
          onPress={addToDoHandler}
        >
          <Text style={styles.buttonText}>add</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ToDoInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'col',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  inputsContainer:{
    flexDirection: 'row',
  },
  numInput:{
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 12,
    height:50,
    width:50,
    textAlign:'center',
    fontSize:16,
    margin:5,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 12,
    paddingHorizontal: 4,
    margin:5,
    width:'25%',
    textAlign:'center'
  },
  descriptionInput:{
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 12,
    margin:5,
    flex:1,
    textAlign:'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    overflow: 'hidden',
    backgroundColor: '#e8eaed',
    borderRadius: 6,
  },
  buttonText: {
    color: 'black',
    paddingVertical: 8,
    paddingHorizontal: 32,
    fontFamily: 'CormorantGaramond-Bold',
    fontSize:15,
  },


  container: {
    backgroundColor: 'white',
  },

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 6,
  },
  placeholderStyle: {
    color:"white",
    fontSize: 16,
    textAlign:'center',
    marginTop:12
  },
  selectedTextStyle: {
    color:"white",
    fontSize: 16,
    textAlign:'center',
    marginTop:12
  },
  listTextStyle:{
    fontSize:12
  },
  itemContainerStyle:{
    width:75
  },
  listContainerStyle:{
    width:75,
  }

});
