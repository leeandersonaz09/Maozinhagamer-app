import React, { useState } from "react";
import { Modal, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/Theme/theme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  memberData: {
    name: string;
    image: string;
    platform: "xbox" | "playstation" | "pc" | "error";
    gamertag: string;
    isValid: boolean;
  } | null;
};

const platformDetails = {
  xbox: { icon: "microsoft-xbox", color: COLORS.xbox },
  playstation: { icon: "sony-playstation", color: COLORS.playstation },
  pc: { icon: "steam", color: COLORS.steam },
  error: { icon: "alert-circle-outline", color: COLORS.error },
};

export const GamertagModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  memberData,
}) => {
  const [copyText, setCopyText] = useState("Copiar");

  if (!memberData) return null;

  const details = platformDetails[memberData.platform];

  const handleCopy = async () => {
    if (!memberData.isValid) return;
    await Clipboard.setStringAsync(memberData.gamertag);
    setCopyText("Copiado!");
    setTimeout(() => setCopyText("Copiar"), 2000); // Reseta o texto após 2 segundos
  };

  const handleClose = () => {
    setCopyText("Copiar"); // Reseta o texto do botão ao fechar
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.modalOverlay}>
        <ThemedView
          style={styles.modalContainer}
          lightColor="#FFF"
          darkColor="#2C2C2C"
        >
          <Image
            source={{ uri: memberData.image }}
            style={styles.memberImage}
          />
          <ThemedText type="title" style={styles.memberName}>
            {memberData.name}
          </ThemedText>

          <ThemedView
            style={styles.gamertagContainer}
            lightColor="#F0F0F0"
            darkColor="#444"
          >
            <MaterialCommunityIcons
              name={details.icon as any}
              size={28}
              color={details.color}
            />
            <ThemedText style={styles.gamertagText}>
              {memberData.gamertag}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            {memberData.isValid && (
              <TouchableOpacity onPress={handleCopy}>
                <ThemedView
                  style={styles.button}
                  lightColor={COLORS.primary}
                  darkColor={COLORS.primary}
                >
                  <ThemedText
                    style={[styles.buttonText, styles.primaryButtonText]}
                  >
                    {copyText}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleClose}>
              <ThemedView
                style={styles.button}
                lightColor="#E5E5E5"
                darkColor="#555"
              >
                <ThemedText style={styles.buttonText}>Fechar</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "75%",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  memberImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 15,
  },
  memberName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gamertagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  gamertagText: {
    fontSize: 15,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "transparent", // Garante que o ThemedView não tenha fundo aqui
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  primaryButtonText: {
    color: COLORS.white,
  },
});

export default GamertagModal;
