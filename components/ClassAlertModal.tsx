// 📢 CLASS ALERT MODAL COMPONENT - Send Online/Physical Class Notifications

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { X, Monitor, MapPin, Clock, Send, Video } from "lucide-react-native";
import Colors from "@/constants/colors";
import DateTimePicker from "./DateTimePicker";

interface ClassAlertModalProps {
  visible: boolean;
  onClose: () => void;
  unitId: string;
  unitName: string;
  onSendAlert: (alertData: any) => void;
}

type ClassType = "online" | "physical";

interface OnlineClassData {
  meetingLink: string;
  platform: string;
  password?: string;
  additionalInfo?: string;
}

interface PhysicalClassData {
  venue: string;
  time: string;
  date: string;
  requirements?: string;
  changes?: string;
}

export default function ClassAlertModal({
  visible,
  onClose,
  unitId,
  unitName,
  onSendAlert,
}: ClassAlertModalProps) {
  const [classType, setClassType] = useState<ClassType>("online");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Online class state
  const [onlineData, setOnlineData] = useState<OnlineClassData>({
    meetingLink: "",
    platform: "",
    password: "",
    additionalInfo: "",
  });

  // Physical class state
  const [physicalData, setPhysicalData] = useState<PhysicalClassData>({
    venue: "",
    time: "",
    date: "",
    requirements: "",
    changes: "",
  });

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setOnlineData({
      meetingLink: "",
      platform: "",
      password: "",
      additionalInfo: "",
    });
    setPhysicalData({
      venue: "",
      time: "",
      date: "",
      requirements: "",
      changes: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSend = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the class alert");
      return;
    }

    if (classType === "online") {
      if (!onlineData.meetingLink.trim() || !onlineData.platform.trim()) {
        Alert.alert("Error", "Please fill in the meeting link and platform");
        return;
      }
    } else {
      if (!physicalData.venue.trim() || !physicalData.time.trim() || !physicalData.date.trim()) {
        Alert.alert("Error", "Please fill in venue, time, and date");
        return;
      }
    }

    const alertData = {
      unitId,
      type: classType,
      title: title.trim(),
      message: message.trim(),
      ...(classType === "online" ? onlineData : physicalData),
      createdAt: Date.now(),
      sentTo: [], // Will be populated with student IDs
    };

    onSendAlert(alertData);
    handleClose();
  };

  const renderOnlineClassForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Online Class Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Meeting Platform *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Zoom, Google Meet, Microsoft Teams"
          placeholderTextColor={Colors.darkGray}
          value={onlineData.platform}
          onChangeText={(text) => setOnlineData(prev => ({ ...prev, platform: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Meeting Link *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="https://zoom.us/j/..."
          placeholderTextColor={Colors.darkGray}
          value={onlineData.meetingLink}
          onChangeText={(text) => setOnlineData(prev => ({ ...prev, meetingLink: text }))}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Meeting Password (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter meeting password if required"
          placeholderTextColor={Colors.darkGray}
          value={onlineData.password}
          onChangeText={(text) => setOnlineData(prev => ({ ...prev, password: text }))}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Additional Information</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any additional instructions or information"
          placeholderTextColor={Colors.darkGray}
          value={onlineData.additionalInfo}
          onChangeText={(text) => setOnlineData(prev => ({ ...prev, additionalInfo: text }))}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderPhysicalClassForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Physical Class Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Venue *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Room 101, Lecture Hall A"
          placeholderTextColor={Colors.darkGray}
          value={physicalData.venue}
          onChangeText={(text) => setPhysicalData(prev => ({ ...prev, venue: text }))}
        />
      </View>

      <DateTimePicker
        label="Date *"
        value={physicalData.date}
        onChange={(value) => setPhysicalData(prev => ({ ...prev, date: value }))}
        mode="date"
        placeholder="Select date"
        minimumDate={new Date()}
      />

      <DateTimePicker
        label="Time *"
        value={physicalData.time}
        onChange={(value) => setPhysicalData(prev => ({ ...prev, time: value }))}
        mode="time"
        placeholder="Select time"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Requirements</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g., Bring laptop, textbook, lab coat"
          placeholderTextColor={Colors.darkGray}
          value={physicalData.requirements}
          onChangeText={(text) => setPhysicalData(prev => ({ ...prev, requirements: text }))}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Schedule Changes (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any changes from regular schedule"
          placeholderTextColor={Colors.darkGray}
          value={physicalData.changes}
          onChangeText={(text) => setPhysicalData(prev => ({ ...prev, changes: text }))}
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Video size={24} color={Colors.primary} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Class Alert</Text>
              <Text style={styles.headerSubtitle}>{unitName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Class Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Type</Text>
            <View style={styles.classTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.classTypeButton,
                  classType === "online" && styles.activeClassType
                ]}
                onPress={() => setClassType("online")}
              >
                <Monitor size={20} color={classType === "online" ? Colors.white : Colors.primary} />
                <Text style={[
                  styles.classTypeText,
                  classType === "online" && styles.activeClassTypeText
                ]}>
                  Online Class
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.classTypeButton,
                  classType === "physical" && styles.activeClassType
                ]}
                onPress={() => setClassType("physical")}
              >
                <MapPin size={20} color={classType === "physical" ? Colors.white : Colors.primary} />
                <Text style={[
                  styles.classTypeText,
                  classType === "physical" && styles.activeClassTypeText
                ]}>
                  Physical Class
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Alert Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alert Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alert Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Today's Class Meeting"
                placeholderTextColor={Colors.darkGray}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message (Optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Additional message to students"
                placeholderTextColor={Colors.darkGray}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Class-specific form */}
          {classType === "online" ? renderOnlineClassForm() : renderPhysicalClassForm()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSend}
          >
            <Send size={16} color={Colors.white} />
            <Text style={[styles.buttonText, styles.sendButtonText]}>Send Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  classTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  classTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    gap: 8,
  },
  activeClassType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  classTypeText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  activeClassTypeText: {
    color: Colors.white,
  },
  formSection: {
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
    minHeight: 80,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sendButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  cancelButtonText: {
    color: Colors.text,
  },
  sendButtonText: {
    color: Colors.white,
  },
});
