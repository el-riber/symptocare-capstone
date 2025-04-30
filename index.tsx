import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import dayjs from 'dayjs';

type Entry = {
  id: string;
  date: string;
  mood: string;
  symptoms: string[];
  note?: string;
};

export default function CalendarScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const docs: Entry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Entry, 'id'>)
      }));

      const sorted = docs.sort((a, b) => {
        return dayjs(b.date).unix() - dayjs(a.date).unix();
      });

      setEntries(sorted);
    };

    fetchEntries();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Entries</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.entryCard}>
            <Text style={styles.date}>{dayjs(item.date).format('MMMM D, YYYY')}</Text>
            <Text style={styles.detail}>Mood: {item.mood}</Text>
            <Text style={styles.detail}>Symptoms: {item.symptoms?.join(', ')}</Text>
            {item.note && <Text style={styles.detail}>Note: {item.note}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 16
  },
  entryCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
    borderColor: '#4DA6FF',
    borderWidth: 1
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6
  },
  detail: {
    fontSize: 14
  }
});
