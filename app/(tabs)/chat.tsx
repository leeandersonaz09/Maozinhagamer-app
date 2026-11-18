import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  authenticateMember,
  ChatMessage,
  getStoredMemberSession,
  logoutMember,
  MAX_CHAT_MESSAGE_LENGTH,
  MemberChatSession,
  normalizeIdentifier,
  sendChatMessage,
  subscribeToChatMessages,
} from "../../src/services/chat/memberChatService";

const TAB_BAR_CLEARANCE_PADDING = 112;
const KEYBOARD_OPEN_PADDING = 12;

const PLATFORM_ICON: Record<
  string,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }
> = {
  xbox: { icon: "microsoft-xbox", color: "#2CA243" },
  playstation: { icon: "sony-playstation", color: "#4D8BFF" },
  pc: { icon: "steam", color: "#93C5FD" },
};

const getAvatarInitial = (name: string): string =>
  name.trim().charAt(0).toUpperCase() || "M";

const formatMessageTime = (timestampMs: number): string => {
  if (!Number.isFinite(timestampMs) || timestampMs <= 0) {
    return "--:--";
  }
  const date = new Date(timestampMs);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDisplayHandle = (handle: string, memberId: string): string => {
  const raw = handle.trim() || memberId.trim();
  if (!raw) {
    return "@membro";
  }
  return raw.startsWith("@") ? raw : `@${raw}`;
};

type AvatarBadgeProps = {
  uri: string | null;
  name: string;
  size: number;
  highlightBorder?: boolean;
};

const AvatarBadge = React.memo(
  ({ uri, name, size, highlightBorder = false }: AvatarBadgeProps) => {
    const borderStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: highlightBorder ? 1.5 : 1,
      borderColor: highlightBorder ? "#FFFB00" : "rgba(255,255,255,0.18)",
    };

    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={[styles.avatarImage, borderStyle]}
          resizeMode="cover"
        />
      );
    }

    return (
      <LinearGradient
        colors={["#D80F22", "#1B1B1B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.avatarFallback, borderStyle]}
      >
        <Text style={[styles.avatarInitial, { fontSize: Math.round(size * 0.42) }]}>
          {getAvatarInitial(name)}
        </Text>
      </LinearGradient>
    );
  }
);

AvatarBadge.displayName = "AvatarBadge";

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
};

const MessageBubble = React.memo(({ message, isOwn }: MessageBubbleProps) => {
  const platformMeta = PLATFORM_ICON[message.platform] ?? PLATFORM_ICON.pc;
  const displayHandle = formatDisplayHandle(message.memberHandle, message.memberId);
  const timeLabel = formatMessageTime(message.createdAtMs);

  return (
    <View
      style={[
        styles.messageRow,
        isOwn ? styles.messageRowOwn : styles.messageRowOther,
      ]}
    >
      {!isOwn ? (
        <View style={styles.messageAvatarLeft}>
          <AvatarBadge
            uri={message.memberAvatar}
            name={message.memberName}
            size={34}
          />
        </View>
      ) : null}

      <View
        style={[
          styles.bubbleContainer,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        <View style={styles.bubbleHeader}>
          <Text
            style={[
              styles.senderName,
              isOwn ? styles.senderNameOwn : styles.senderNameOther,
            ]}
            numberOfLines={1}
          >
            {message.memberName}
          </Text>
          <MaterialCommunityIcons
            name={platformMeta.icon}
            size={12}
            color={isOwn ? "rgba(255,255,255,0.85)" : platformMeta.color}
            style={styles.platformMiniIcon}
          />
          <Text
            style={[
              styles.senderHandle,
              isOwn ? styles.senderHandleOwn : styles.senderHandleOther,
            ]}
            numberOfLines={1}
          >
            {displayHandle}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isOwn ? styles.messageTimeOwn : styles.messageTimeOther,
            ]}
          >
            {timeLabel}
          </Text>
        </View>

        <Text style={styles.messageText} selectable>
          {message.text}
        </Text>
      </View>

      {isOwn ? (
        <View style={styles.messageAvatarRight}>
          <AvatarBadge
            uri={message.memberAvatar}
            name={message.memberName}
            size={34}
            highlightBorder
          />
        </View>
      ) : null}
    </View>
  );
});

MessageBubble.displayName = "MessageBubble";

export default function MemberChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<ChatMessage> | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);
  const previousCountRef = useRef(0);
  const hasInitialScrollRef = useRef(false);

  const [session, setSession] = useState<MemberChatSession | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [subscriptionRevision, setSubscriptionRevision] = useState(0);

  const [draftMessage, setDraftMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const stored = await getStoredMemberSession();
        if (isMounted) {
          setSession(stored);
        }
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setMessages([]);
      setIsLoadingMessages(false);
      setChatError(null);
      previousCountRef.current = 0;
      hasInitialScrollRef.current = false;
      return;
    }

    setIsLoadingMessages(true);
    setChatError(null);

    const unsubscribe = subscribeToChatMessages(
      (nextMessages) => {
        setMessages(nextMessages);
        setIsLoadingMessages(false);
        setChatError(null);
      },
      (error) => {
        setIsLoadingMessages(false);
        setChatError(error.message || "Falha na conexão com o chat em tempo real.");
      }
    );

    return () => {
      unsubscribe();
    };
  }, [session, subscriptionRevision]);

  useEffect(() => {
    if (messages.length === 0) {
      previousCountRef.current = 0;
      return;
    }

    if (messages.length > previousCountRef.current) {
      const animated = hasInitialScrollRef.current;
      hasInitialScrollRef.current = true;
      previousCountRef.current = messages.length;

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated });
      });
    } else {
      previousCountRef.current = messages.length;
    }
  }, [messages.length]);

  const handleLogin = useCallback(async () => {
    if (isAuthenticating) {
      return;
    }

    setLoginError(null);
    setIsAuthenticating(true);
    Keyboard.dismiss();

    try {
      const nextSession = await authenticateMember(identifier, password);
      setSession(nextSession);
      setIdentifier("");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar no chat. Tente novamente.";
      setLoginError(message);
    } finally {
      setIsAuthenticating(false);
    }
  }, [identifier, isAuthenticating, password]);

  const handleLogout = useCallback(async () => {
    await logoutMember();
    setSession(null);
    setDraftMessage("");
    setSendError(null);
    setChatError(null);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!session || isSending) {
      return;
    }

    const trimmed = draftMessage.trim();
    if (!trimmed) {
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      await sendChatMessage(session, trimmed);
      setDraftMessage("");
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao enviar mensagem. Tente novamente.";
      setSendError(message);
    } finally {
      setIsSending(false);
    }
  }, [draftMessage, isSending, session]);

  const handleRetrySync = useCallback(() => {
    setSubscriptionRevision((prev) => prev + 1);
  }, []);

  const handleOpenMembers = useCallback(() => {
    router.push("/(tabs)/members");
  }, [router]);

  const normalizedSessionMemberId = useMemo(
    () => (session ? normalizeIdentifier(session.memberId) : ""),
    [session]
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const renderMessageItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isOwn = Boolean(
        session &&
          ((item.memberDocId && item.memberDocId === session.id) ||
            (item.memberId &&
              normalizeIdentifier(item.memberId) === normalizedSessionMemberId))
      );

      return <MessageBubble message={item} isOwn={isOwn} />;
    },
    [normalizedSessionMemberId, session]
  );

  const canSend = draftMessage.trim().length > 0 && !isSending;

  if (isHydrating) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={["top"]}>
        <ActivityIndicator size="large" color="#D80F22" />
        <Text style={styles.loadingLabel}>Verificando acesso VIP...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.loginScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient
              colors={["#3A0508", "#14090A", "#080808"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginHero}
            >
              <View style={styles.vipBadge}>
                <MaterialCommunityIcons
                  name="crown"
                  size={14}
                  color="#FFFB00"
                />
                <Text style={styles.vipBadgeText}>EXCLUSIVO MEMBROS</Text>
              </View>

              <View style={styles.heroIconWrap}>
                <MaterialCommunityIcons
                  name="message-lock"
                  size={30}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.loginTitle}>CHAT VIP DO CANAL</Text>
              <Text style={styles.loginSubtitle}>
                Entre com o seu ID ou Gamertag de membro (@LeeBrasil,
                @Caduvilacha, etc.) e a senha cadastrada no Firebase para
                conversar ao vivo com a tropa.
              </Text>
            </LinearGradient>

            <View style={styles.loginCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ID DO MEMBRO OU GAMERTAG</Text>
                <View style={styles.inputFieldRow}>
                  <MaterialCommunityIcons
                    name="at"
                    size={20}
                    color="#C39200"
                    style={styles.inputLeadingIcon}
                  />
                  <TextInput
                    value={identifier}
                    onChangeText={(value) => {
                      setIdentifier(value);
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
                    placeholder="Ex: @LeeBrasil ou sua gamertag"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    returnKeyType="next"
                    editable={!isAuthenticating}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    style={styles.textInput}
                    accessibilityLabel="ID do membro ou gamertag"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SENHA VIP</Text>
                <View style={styles.inputFieldRow}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color="#C39200"
                    style={styles.inputLeadingIcon}
                  />
                  <TextInput
                    ref={passwordInputRef}
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (loginError) {
                        setLoginError(null);
                      }
                    }}
                    placeholder="Digite sua senha de membro"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    returnKeyType="done"
                    editable={!isAuthenticating}
                    onSubmitEditing={handleLogin}
                    style={styles.textInput}
                    accessibilityLabel="Senha de acesso do membro"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeButton}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {loginError ? (
                <View style={styles.errorBanner} accessibilityRole="alert">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={18}
                    color="#EF4444"
                  />
                  <Text style={styles.errorBannerText}>{loginError}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isAuthenticating}
                activeOpacity={0.85}
                style={styles.loginSubmitWrap}
                accessibilityRole="button"
                accessibilityLabel="Entrar no chat"
              >
                <LinearGradient
                  colors={
                    isAuthenticating
                      ? ["#6B1D1D", "#4A0E0E"]
                      : ["#D80F22", "#8E0000"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginSubmitButton}
                >
                  {isAuthenticating ? (
                    <View style={styles.buttonInlineRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.loginSubmitText}>VERIFICANDO...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonInlineRow}>
                      <MaterialCommunityIcons
                        name="login-variant"
                        size={19}
                        color="#FFFFFF"
                      />
                      <Text style={styles.loginSubmitText}>ENTRAR NO CHAT</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <MaterialCommunityIcons
                  name="shield-account"
                  size={20}
                  color="#C39200"
                />
                <Text style={styles.infoCardTitle}>ACESSO RESTRITO</Text>
              </View>
              <Text style={styles.infoCardBody}>
                Apenas membros cadastrados na aba Membros possuem acesso a esta
                sala. Consulte os perfis oficiais para confirmar seu ID ou
                gamertag.
              </Text>
              <Pressable
                onPress={handleOpenMembers}
                style={({ pressed }) => [
                  styles.membersLinkButton,
                  pressed && styles.membersLinkButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Ver lista de Membros"
              >
                <MaterialCommunityIcons
                  name="account-group"
                  size={17}
                  color="#FFFB00"
                />
                <Text style={styles.membersLinkText}>Ver lista de Membros</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color="#FFFB00"
                />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <LinearGradient
        colors={["#2B0407", "#121212"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.chatHeader}
      >
        <View style={styles.chatHeaderLeft}>
          <AvatarBadge
            uri={session.avatar}
            name={session.name}
            size={44}
            highlightBorder
          />
          <View style={styles.chatHeaderMeta}>
            <View style={styles.chatHeaderNameRow}>
              <Text style={styles.chatHeaderName} numberOfLines={1}>
                {session.name}
              </Text>
              <View style={styles.headerVipPill}>
                <Text style={styles.headerVipPillText}>VIP</Text>
              </View>
            </View>
            <View style={styles.chatHeaderSubRow}>
              <Text style={styles.chatHeaderHandle} numberOfLines={1}>
                {session.handle}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  chatError ? styles.statusDotError : styles.statusDotLive,
                ]}
              />
              <Text style={styles.statusLabel}>
                {chatError ? "Offline" : "Tempo real"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sair do chat"
        >
          <MaterialCommunityIcons name="logout" size={17} color="#F4F4F5" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </LinearGradient>

      {chatError ? (
        <View style={styles.connectionBanner}>
          <MaterialCommunityIcons
            name="wifi-alert"
            size={16}
            color="#FCA5A5"
          />
          <Text style={styles.connectionBannerText} numberOfLines={2}>
            {chatError}
          </Text>
          <TouchableOpacity
            onPress={handleRetrySync}
            style={styles.retryPill}
            accessibilityRole="button"
            accessibilityLabel="Tentar reconectar chat"
          >
            <Text style={styles.retryPillText}>Tentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={styles.chatBody}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.messagesListContent,
            messages.length === 0 && styles.messagesListEmpty,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
          maxToRenderPerBatch={15}
          windowSize={9}
          ListEmptyComponent={
            isLoadingMessages ? (
              <View style={styles.emptyStateCard}>
                <ActivityIndicator size="large" color="#D80F22" />
                <Text style={styles.emptyStateTitle}>Conectando à sala VIP...</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Sincronizando mensagens em tempo real com o Firebase.
                </Text>
              </View>
            ) : (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyIconCircle}>
                  <MaterialCommunityIcons
                    name="chat-processing-outline"
                    size={28}
                    color="#C39200"
                  />
                </View>
                <Text style={styles.emptyStateTitle}>Nenhuma mensagem ainda</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Mande a primeira mensagem para começar a resenha com os
                  membros do canal!
                </Text>
              </View>
            )
          }
        />

        {sendError ? (
          <View style={styles.sendErrorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={16}
              color="#FCA5A5"
            />
            <Text style={styles.sendErrorText}>{sendError}</Text>
            <TouchableOpacity
              onPress={() => setSendError(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Fechar aviso de erro"
            >
              <MaterialCommunityIcons name="close" size={16} color="#FCA5A5" />
            </TouchableOpacity>
          </View>
        ) : null}

        <View
          style={[
            styles.composerContainer,
            {
              paddingBottom: isKeyboardVisible
                ? KEYBOARD_OPEN_PADDING
                : TAB_BAR_CLEARANCE_PADDING,
            },
          ]}
        >
          <View style={styles.composerRow}>
            <View style={styles.composerInputWrap}>
              <TextInput
                value={draftMessage}
                onChangeText={(value) => {
                  setDraftMessage(value);
                  if (sendError) {
                    setSendError(null);
                  }
                }}
                placeholder="Escreva para os membros VIP..."
                placeholderTextColor="#71717A"
                multiline
                maxLength={MAX_CHAT_MESSAGE_LENGTH}
                editable={!isSending}
                style={styles.composerInput}
                textAlignVertical="center"
                accessibilityLabel="Campo de mensagem do chat"
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!canSend}
              activeOpacity={0.85}
              style={[
                styles.sendButton,
                canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Enviar mensagem"
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons
                  name="send"
                  size={20}
                  color={canSend ? "#FFFFFF" : "#52525B"}
                />
              )}
            </TouchableOpacity>
          </View>

          {draftMessage.length >= 400 ? (
            <Text
              style={[
                styles.charCounter,
                draftMessage.length >= MAX_CHAT_MESSAGE_LENGTH &&
                  styles.charCounterLimit,
              ]}
            >
              {draftMessage.length}/{MAX_CHAT_MESSAGE_LENGTH}
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: "#080808",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingLabel: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  loginScrollContent: {
    paddingBottom: 124,
  },
  loginHero: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 26,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(216, 15, 34, 0.35)",
  },
  vipBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 251, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(195, 146, 0, 0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  vipBadgeText: {
    color: "#FFFB00",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  loginTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  loginSubtitle: {
    marginTop: 8,
    color: "#D4D4D8",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  loginCard: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 18,
    backgroundColor: "#121212",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: "#D4D4D8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  inputFieldRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
  },
  inputLeadingIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 12,
  },
  eyeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -8,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.45)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorBannerText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  loginSubmitWrap: {
    marginTop: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  loginSubmitButton: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginSubmitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    backgroundColor: "#121212",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(195, 146, 0, 0.25)",
    gap: 10,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoCardTitle: {
    color: "#FFFB00",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  infoCardBody: {
    color: "#A1A1AA",
    fontSize: 13,
    lineHeight: 19,
  },
  membersLinkButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255, 251, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(195, 146, 0, 0.45)",
    paddingHorizontal: 14,
  },
  membersLinkButtonPressed: {
    opacity: 0.78,
  },
  membersLinkText: {
    color: "#FFFB00",
    fontSize: 13,
    fontWeight: "800",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  chatHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 10,
  },
  chatHeaderMeta: {
    flex: 1,
    gap: 3,
  },
  chatHeaderNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatHeaderName: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  headerVipPill: {
    backgroundColor: "rgba(255, 251, 0, 0.15)",
    borderWidth: 1,
    borderColor: "#C39200",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  headerVipPillText: {
    color: "#FFFB00",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  chatHeaderSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chatHeaderHandle: {
    flexShrink: 1,
    color: "#A1A1AA",
    fontSize: 12,
    fontWeight: "700",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },
  statusDotLive: {
    backgroundColor: "#22C55E",
  },
  statusDotError: {
    backgroundColor: "#EF4444",
  },
  statusLabel: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "700",
  },
  logoutButton: {
    minHeight: 44,
    minWidth: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  logoutButtonText: {
    color: "#F4F4F5",
    fontSize: 12,
    fontWeight: "800",
  },
  connectionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    borderBottomWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  connectionBannerText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
  retryPill: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  retryPillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  chatBody: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 12,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyStateCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginHorizontal: 8,
    gap: 10,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(195, 146, 0, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(195, 146, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyStateSubtitle: {
    color: "#A1A1AA",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  avatarImage: {
    backgroundColor: "#1F1F1F",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
  },
  messageRowOwn: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  messageAvatarLeft: {
    marginRight: 8,
    marginBottom: 2,
  },
  messageAvatarRight: {
    marginLeft: 8,
    marginBottom: 2,
  },
  bubbleContainer: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
  },
  bubbleOwn: {
    backgroundColor: "#C62828",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#1A1A1A",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 4,
  },
  bubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "900",
    maxWidth: 120,
  },
  senderNameOwn: {
    color: "#FFFFFF",
  },
  senderNameOther: {
    color: "#FFFFFF",
  },
  platformMiniIcon: {
    marginHorizontal: 1,
  },
  senderHandle: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },
  senderHandleOwn: {
    color: "rgba(255, 251, 0, 0.9)",
  },
  senderHandleOther: {
    color: "#C39200",
  },
  messageTime: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: "auto",
  },
  messageTimeOwn: {
    color: "rgba(255, 255, 255, 0.78)",
  },
  messageTimeOther: {
    color: "#71717A",
  },
  messageText: {
    color: "#F4F4F5",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
  },
  sendErrorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  sendErrorText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
  composerContainer: {
    backgroundColor: "#0E0E0E",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  composerInputWrap: {
    flex: 1,
    minHeight: 48,
    maxHeight: 112,
    backgroundColor: "#171717",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    justifyContent: "center",
  },
  composerInput: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 92,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#C62828",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  sendButtonDisabled: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  charCounter: {
    marginTop: 6,
    textAlign: "right",
    color: "#C39200",
    fontSize: 11,
    fontWeight: "700",
  },
  charCounterLimit: {
    color: "#EF4444",
  },
});
