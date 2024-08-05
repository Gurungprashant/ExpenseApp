import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const ExpenseDetailScreen = ({ route }) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const expenseDoc = doc(db, 'expenses', expenseId);
        const expenseSnapshot = await getDoc(expenseDoc);
        if (expenseSnapshot.exists()) {
          setExpense(expenseSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching expense details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading expense details.</Text>
      </View>
    );
  }

  // Format date using JavaScript's built-in Date object
  const formattedDate = expense.date.toDate().toLocaleDateString();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{expense.name}</Text>
        <Text style={styles.price}>${expense.price.toFixed(2)}</Text>
        <Text style={styles.date}>Date: {formattedDate}</Text>
        <Text style={styles.location}>Location: {expense.location}</Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default ExpenseDetailScreen;
