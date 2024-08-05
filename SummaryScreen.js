import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';

const SummaryScreen = () => {
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    highestTransaction: { amount: 0, name: 'No transactions' },
    lowestTransaction: { amount: Infinity, name: 'No transactions' },
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', userId) // Filter by user ID
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        let totalAmount = 0;
        let highestTransaction = { amount: 0, name: 'No transactions' };
        let lowestTransaction = { amount: Infinity, name: 'No transactions' };

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log('Expense data:', data); // Debugging line to check the data structure

          totalAmount += data.price;

          if (data.price > highestTransaction.amount) {
            highestTransaction = { amount: data.price, name: data.name || 'Unnamed' };
          }
          if (data.price < lowestTransaction.amount) {
            lowestTransaction = { amount: data.price, name: data.name || 'Unnamed' };
          }
        });

        setSummary({
          totalTransactions: snapshot.size,
          totalAmount,
          highestTransaction,
          lowestTransaction,
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses: ', error);
        setError('Error fetching expenses');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Expense Summary</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Transactions</Text>
        <Text style={styles.cardValue}>{summary.totalTransactions}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Amount</Text>
        <Text style={styles.cardValue}>${summary.totalAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Highest Transaction</Text>
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionName}>{summary.highestTransaction.name}</Text>
          <Text style={styles.transactionPrice}>${summary.highestTransaction.amount.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lowest Transaction</Text>
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionName}>{summary.lowestTransaction.name}</Text>
          <Text style={styles.transactionPrice}>${summary.lowestTransaction.amount.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionName: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  transactionPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SummaryScreen;
