import {
    StyleSheet,
    Text,
    View,
    FlatList,
  } from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SpentMoneyHistory from '../screens/SpentMoneyHistory';
import GaveMoneyHistory from '../screens/GaveMoneyHistory';
import { Ionicons, FontAwesome} from '@expo/vector-icons';

const Tab=createBottomTabNavigator();
const Stack=createNativeStackNavigator();

function HistoryUI(){
    return(
        <Stack.Navigator initialRouteName='SpentMoneyHistory'>
            <Stack.Screen
                name="TabNavigation"
                component={TabNavigator}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
}

const TabNavigator=()=>{
    return <Tab.Navigator
            initialRouteName='SpentMoneyHistory'
            screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarStyle: { backgroundColor: '#202124', paddingBottom: 2 },
            
            safeAreaInsets: { bottom: 0 },
            }}
        >
       <Tab.Screen 
            name="SpentMoneyHistory" 
            component={SpentMoneyHistory}
            options={{title:'Spent Money', 
                tabBarIcon:({focussed}) =>
                (<Ionicons name="fast-food-outline" size={12} color="white" />), 
                headerShown: false}}
                initialParams={{ history: [] }}
        />
        <Tab.Screen 
            name="GaveMoneyHistory" 
            component={GaveMoneyHistory}
            options={{title:'Gave Money', 
                tabBarIcon:({focussed}) =>
                (<FontAwesome name="arrows-h" size={24} color="white" />), 
                headerShown: false}}
                initialParams={{ history: [] }}
        />
    </Tab.Navigator>
}

export default HistoryUI;

const styles=StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:'black',
    }
})