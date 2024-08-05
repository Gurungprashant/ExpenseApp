import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from './firebase';

const AddExpenseScreen = ({ navigation }) => {
  const [name, setName] = useState(''); // Expense Name
  const [price, setPrice] = useState(''); // Expense Price
  const [date, setDate] = useState(new Date()); // Expense Date
  const [location, setLocation] = useState(''); // Expense Location
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const handleAddExpense = async () => {
    const userId = auth.currentUser?.uid; // Get the current user's ID

    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (name === '' || price === '' || !date || location === '') { // Ensure all fields are filled
      setError('Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        name, // Expense Name
        price: parseFloat(price),
        date,
        location, // Expense Location
        userId, // Associate with user ID
      });
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: () => {
          // Clear fields after successful addition
          setName('');
          setPrice('');
          setDate(new Date());
          setLocation('');
          navigation.navigate('ExpenseList');
        } }
      ]);
    } catch (error) {
      console.error('Error adding expense: ', error);
      setError('Error adding expense');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keep the picker open on iOS
    setDate(currentDate);
  };

  // Format the date as 'yyyy-mm-dd'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Expense</Text>
      
      <TextInput
        placeholder="Expense Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#f44336',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default AddExpenseScreen;
