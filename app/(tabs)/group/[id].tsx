import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MessageSquare, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import { mockGroups, mockUsers } from "@/mocks/data";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Group, User } from "@/types";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [group, setGroup] = useState<Group | undefined>();
  const [members, setMembers] = useState<User[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    const groupData = mockGroups.find(g => g.id === id);
    setGroup(groupData);
    
    if (groupData) {
      // Get group members
      const groupMembers = mockUsers.filter(user => 
        groupData.members.includes(user.id)
      );
      setMembers(groupMembers);
    }
  }, [id]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send a message to the group
    alert(`Message sent: ${message}`);
    setMessage("");
  };

  const renderMemberItem = ({ item }: { item: User }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberInitial}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>
          {item.role === "lecturer" ? "Lecturer" : "Student"}
        </Text>
      </View>
    </View>
  );

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{group.name}</Text>
        
        {group.description && (
          <Text style={styles.description}>{group.description}</Text>
        )}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Users size={16} color={Colors.darkGray} />
            <Text style={styles.metaText}>
              {group.members.length} members
            </Text>
          </View>
          
          <Text style={styles.createdAt}>
            Created on {formatDate(group.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Members</Text>
        
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={item => item.id}
          style={styles.membersList}
        />
      </View>

      <View style={styles.footer}>
        <Input
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          leftIcon={<MessageSquare size={20} color={Colors.darkGray} />}
        />
        
        <Button
          title="Send"
          onPress={handleSendMessage}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  createdAt: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    flexDirection: "row",
    alignItems: "center",
  },
});