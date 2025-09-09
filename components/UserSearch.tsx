import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Input from './Input';
import Button from './Button';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer';
}

interface UserSearchProps {
  onUserSelect?: (user: User) => void;
  placeholder?: string;
  selectedUsers?: User[];
  maxSelection?: number;
}

export default function UserSearch({
  onUserSelect,
  placeholder = "Search for users...",
  selectedUsers = [],
  maxSelection = 1
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock user data - replace with actual API call
  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@university.edu', role: 'student' },
    { id: '2', name: 'Jane Smith', email: 'jane@university.edu', role: 'lecturer' },
    { id: '3', name: 'Bob Johnson', email: 'bob@university.edu', role: 'student' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      // Filter mock users based on search query
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user: User) => {
    if (selectedUsers.length < maxSelection || selectedUsers.some(u => u.id === user.id)) {
      onUserSelect?.(user);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <Button
      title={`${item.name} (${item.email}) - ${item.role}`}
      onPress={() => handleUserSelect(item)}
      variant="outline"
      size="small"
      style={styles.userItem}
    />
  );

  return (
    <View style={styles.container}>
      <Input
        label="Search Users"
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleSearch}
        leftIcon={<Search size={20} color={Colors.darkGray} />}
      />

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {isSearching && (
        <View style={styles.loading}>
          <Button title="Searching..." loading variant="outline" size="small" onPress={() => {}} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  resultsList: {
    maxHeight: 200,
    marginTop: 8,
  },
  userItem: {
    marginBottom: 4,
  },
  loading: {
    marginTop: 8,
    alignItems: 'center',
  },
});
