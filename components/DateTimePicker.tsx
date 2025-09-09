// 📅 MODERN DATE TIME PICKER COMPONENT - Aesthetic & Easy Date/Time Input

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { Calendar, Clock, X } from "lucide-react-native";
import Colors from "@/constants/colors";

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mode: "date" | "time" | "datetime";
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DateTimePicker({
  label,
  value,
  onChange,
  mode,
  placeholder = "",
  minimumDate,
  maximumDate,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // Parse current value or use current date/time
  const getCurrentDate = () => {
    if (value) {
      if (mode === "date") {
        return new Date(value + "T00:00:00");
      } else if (mode === "time") {
        const today = new Date();
        const [hours, minutes] = value.split(":");
        today.setHours(parseInt(hours), parseInt(minutes));
        return today;
      }
    }
    return new Date();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;

    if (mode === "date") {
      const date = new Date(value + "T00:00:00");
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else if (mode === "time") {
      const [hours, minutes] = value.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return value;
  };

  const handlePress = () => {
    setTempDate(getCurrentDate());
    setShowPicker(true);
  };

  const handleConfirm = () => {
    if (tempDate) {
      if (mode === "date") {
        onChange(formatDate(tempDate));
      } else if (mode === "time") {
        onChange(formatTime(tempDate));
      }
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(null);
    setShowPicker(false);
  };

  const adjustDate = (direction: "up" | "down", unit: "year" | "month" | "day" | "hour" | "minute") => {
    if (!tempDate) return;

    const newDate = new Date(tempDate);

    switch (unit) {
      case "year":
        newDate.setFullYear(newDate.getFullYear() + (direction === "up" ? 1 : -1));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "up" ? 1 : -1));
        break;
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "up" ? 1 : -1));
        break;
      case "hour":
        newDate.setHours(newDate.getHours() + (direction === "up" ? 1 : -1));
        break;
      case "minute":
        newDate.setMinutes(newDate.getMinutes() + (direction === "up" ? 5 : -5));
        break;
    }

    // Apply min/max constraints
    if (minimumDate && newDate < minimumDate) return;
    if (maximumDate && newDate > maximumDate) return;

    setTempDate(newDate);
  };

  const renderPickerModal = () => {
    if (!tempDate) return null;

    const renderDatePicker = () => (
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>Select Date</Text>

        {/* Year */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("up", "year")}
          >
            <Text style={styles.adjustButtonText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Year</Text>
            <Text style={styles.valueText}>{tempDate.getFullYear()}</Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("down", "year")}
          >
            <Text style={styles.adjustButtonText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Month */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("up", "month")}
          >
            <Text style={styles.adjustButtonText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Month</Text>
            <Text style={styles.valueText}>
              {tempDate.toLocaleString("default", { month: "short" })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("down", "month")}
          >
            <Text style={styles.adjustButtonText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Day */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("up", "day")}
          >
            <Text style={styles.adjustButtonText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Day</Text>
            <Text style={styles.valueText}>{tempDate.getDate()}</Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("down", "day")}
          >
            <Text style={styles.adjustButtonText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const renderTimePicker = () => (
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>Select Time</Text>

        {/* Hour */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("up", "hour")}
          >
            <Text style={styles.adjustButtonText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Hour</Text>
            <Text style={styles.valueText}>
              {tempDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              }).split(" ")[0]}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("down", "hour")}
          >
            <Text style={styles.adjustButtonText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Minute */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("up", "minute")}
          >
            <Text style={styles.adjustButtonText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Minute</Text>
            <Text style={styles.valueText}>
              {String(tempDate.getMinutes()).padStart(2, "0")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => adjustDate("down", "minute")}
          >
            <Text style={styles.adjustButtonText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* AM/PM */}
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={[styles.adjustButton, styles.wideButton]}
            onPress={() => {
              const newDate = new Date(tempDate);
              const hours = newDate.getHours();
              if (hours >= 12) {
                newDate.setHours(hours - 12);
              } else {
                newDate.setHours(hours + 12);
              }
              setTempDate(newDate);
            }}
          >
            <Text style={styles.adjustButtonText}>AM/PM</Text>
          </TouchableOpacity>
          <View style={[styles.valueContainer, styles.wideContainer]}>
            <Text style={styles.valueLabel}>Period</Text>
            <Text style={styles.valueText}>
              {tempDate.getHours() >= 12 ? "PM" : "AM"}
            </Text>
          </View>
        </View>
      </View>
    );

    return (
      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancel} style={styles.modalClose}>
              <X size={24} color={Colors.darkGray} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {mode === "date" ? "Select Date" : mode === "time" ? "Select Time" : "Select Date & Time"}
            </Text>
            <TouchableOpacity onPress={handleConfirm} style={styles.modalDone}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Picker Content */}
          <View style={styles.modalContent}>
            {mode === "date" && renderDatePicker()}
            {mode === "time" && renderTimePicker()}
            {mode === "datetime" && (
              <>
                {renderDatePicker()}
                {renderTimePicker()}
              </>
            )}
          </View>

          {/* Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewValue}>
              {mode === "date" && tempDate && formatDate(tempDate)}
              {mode === "time" && tempDate && formatTime(tempDate)}
              {mode === "datetime" && tempDate && `${formatDate(tempDate)} ${formatTime(tempDate)}`}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[styles.inputContainer, !value && styles.inputContainerEmpty]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.inputContent}>
            {mode === "date" && <Calendar size={20} color={value ? Colors.primary : Colors.darkGray} />}
            {mode === "time" && <Clock size={20} color={value ? Colors.primary : Colors.darkGray} />}
            <Text style={[styles.inputText, !value && styles.inputTextPlaceholder]}>
              {getDisplayValue()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {renderPickerModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
  },
  inputContainerEmpty: {
    borderColor: Colors.divider,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  inputTextPlaceholder: {
    color: Colors.darkGray,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalClose: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  modalDone: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalDoneText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  pickerSection: {
    marginBottom: 32,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  adjustButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  adjustButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  wideButton: {
    width: 80,
  },
  valueContainer: {
    flex: 1,
    alignItems: "center",
  },
  wideContainer: {
    flex: 2,
  },
  valueLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  previewContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.lightGray,
  },
  previewLabel: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
});
