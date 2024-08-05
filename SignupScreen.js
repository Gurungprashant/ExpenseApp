import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (email === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login'); // Navigate to the Login screen
            setEmail('');
            setPassword('');
          }
        }
      ]);
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TouchableHighlight style={styles.button} onPress={handleSignup} underlayColor="#0056b3">
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 14,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
