import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Badge = ({ label, active }) => {
  return (
    <TouchableOpacity style={[styles.badge, active && styles.activeBadge]}>
      <Text style={[styles.badgeText, active && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  activeBadge: {
    backgroundColor: "#C20034FF",
  },
  badgeText: {
    color: "#777",
    fontSize: 14,
  },
  activeText: {
    color: "#000000FF",
  },
});

export default Badge;
