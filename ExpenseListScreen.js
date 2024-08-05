import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Helper function to format date to 'Month Year'
const formatMonth = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return ''; // Handle undefined or invalid dates
  }
  const options = { year: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Helper function to group expenses by month
const groupExpensesByMonth = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date.toDate());
    const month = formatMonth(expenseDate);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(expense);
    return acc;
  }, {});
};

// Helper function to get sorted months
const getSortedMonths = (groupedExpenses) => {
  return Object.keys(groupedExpenses).sort((a, b) => {
    const [aMonth, aYear] = a.split(' ');
    const [bMonth, bYear] = b.split(' ');

    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndexA = monthOrder.indexOf(aMonth);
    const monthIndexB = monthOrder.indexOf(bMonth);

    if (aYear !== bYear) {
      return aYear - bYear;
    }
    return monthIndexA - monthIndexB;
  });
};

const ExpenseListScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonths, setExpandedMonths] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const expenseList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          price: data.price || 0,
          date: data.date ? data.date.toDate() : new Date(), // Convert Firestore Timestamp to Date
        };
      });
      setExpenses(expenseList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching expenses: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const groupedExpenses = groupExpensesByMonth(expenses);
  const sortedMonths = getSortedMonths(groupedExpenses);

  const handleToggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedMonths}
        keyExtractor={(item) => item}
        renderItem={({ item: month }) => (
          <View style={styles.monthContainer}>
            <TouchableOpacity onPress={() => handleToggleMonth(month)} style={styles.monthHeader}>
              <Text style={styles.monthTitle}>{month}</Text>
              <Icon
                name={expandedMonths[month] ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#007BFF"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
            {expandedMonths[month] && (
              <View style={styles.expenseList}>
                {groupedExpenses[month].map(expense => (
                  <TouchableOpacity key={expense.id} onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}>
                    <View style={styles.item}>
                      <View style={styles.itemContent}>
                        <Icon name="cash" size={30} color="#4CAF50" style={styles.itemIcon} />
                        <View style={styles.itemText}>
                          <Text style={styles.name}>{expense.name}</Text>
                          <Text style={styles.price}>${expense.price.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  monthContainer: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  expenseList: {
    paddingLeft: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  name: { // Changed 'productName' to 'name'
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpenseListScreen;
