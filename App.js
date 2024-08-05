import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import ExpenseListScreen from './ExpenseListScreen';
import ExpenseDetailScreen from './ExpenseDetailScreen';
import AddExpenseScreen from './AddExpenseScreen';
import SummaryScreen from './SummaryScreen';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ExpenseList" 
      component={ExpenseListScreen} 
      options={{
        title: 'Expense List',
        headerRight: () => (
          <TouchableOpacity style={styles.logoutButton} onPress={async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'There was an error signing out. Please try again.');
            }
          }}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        ),
      }} 
    />
    <Stack.Screen 
      name="ExpenseDetail" 
      component={ExpenseDetailScreen} 
      options={{ title: 'Expense Detail' }} 
    />
  </Stack.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Add Expense') {
                iconName = 'add';
              } else if (route.name === 'Summary') {
                iconName = 'list';
              }

              return <Icon name={iconName} color={color} size={size} />;
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack} 
            options={{headerShown: false}}
          />
          <Tab.Screen 
            name="Add Expense" 
            component={AddExpenseScreen} 
            options={{headerShown: false}}
          />
          <Tab.Screen 
            name="Summary" 
            component={SummaryScreen} 
            options={{headerShown: false}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
