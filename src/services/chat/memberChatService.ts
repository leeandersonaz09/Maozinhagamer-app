import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../utils/firebaseConfig";

export const MEMBER_SESSION_STORAGE_KEY = "@maozinha:member_chat_session";
export const MAX_CHAT_MESSAGE_LENGTH = 500;
const CHAT_MESSAGES_LIMIT = 100;

const IDENTIFIER_ALIASES: Record<string, string> = {
  kduvilacha: "caduvilacha",
};

export type MemberChatSession = {
  id: string;
  memberId: string;
  name: string;
  handle: string;
  avatar: string | null;
  platform: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  memberDocId?: string;
  memberId: string;
  memberName: string;
  memberHandle: string;
  memberAvatar: string | null;
  platform: string;
  createdAtMs: number;
};

type FirestoreMemberDoc = {
  name?: unknown;
  image?: unknown;
  avatar?: unknown;
  memberId?: unknown;
  followers?: unknown;
  password?: unknown;
  xbox?: unknown;
  xboxTag?: unknown;
  ps?: unknown;
  playstationTag?: unknown;
  pc?: unknown;
  pcTag?: unknown;
};

let pendingAuthPromise: Promise<void> | null = null;

export const normalizeIdentifier = (value: string): string =>
  value.trim().toLowerCase().replace(/^@+/, "");

const resolveIdentifierAlias = (value: string): string => {
  const normalized = normalizeIdentifier(value);
  return IDENTIFIER_ALIASES[normalized] ?? normalized;
};

const pickNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const ensureAtPrefix = (value: string): string => {
  const cleaned = value.trim().replace(/^@+/, "");
  return cleaned.length > 0 ? `@${cleaned}` : "@membro";
};

const resolvePrimaryPlatform = (data: FirestoreMemberDoc): string => {
  if (Boolean(data.xbox) || pickNonEmptyString(data.xboxTag)) {
    return "xbox";
  }
  if (Boolean(data.ps) || pickNonEmptyString(data.playstationTag)) {
    return "playstation";
  }
  if (Boolean(data.pc) || pickNonEmptyString(data.pcTag)) {
    return "pc";
  }
  return "pc";
};

const getFirebaseErrorCode = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return "";
};

const waitForAuthReady = async (): Promise<void> => {
  const authWithReady = FIREBASE_AUTH as typeof FIREBASE_AUTH & {
    authStateReady?: () => Promise<void>;
  };

  if (typeof authWithReady.authStateReady === "function") {
    await authWithReady.authStateReady().catch(() => {});
  }
};

export async function ensureFirebaseAuthForMember(memberDocId: string): Promise<void> {
  const email = `member_${memberDocId.toLowerCase()}@maozinhagamer.app`;
  const authPass = `MzMember#${memberDocId}_2026`;

  if (FIREBASE_AUTH.currentUser?.email === email) {
    return;
  }

  if (pendingAuthPromise) {
    return pendingAuthPromise;
  }

  pendingAuthPromise = (async () => {
    await waitForAuthReady();

    if (FIREBASE_AUTH.currentUser?.email === email) {
      return;
    }

    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, authPass);
    } catch (signInError) {
      const code = getFirebaseErrorCode(signInError);

      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, authPass);
        return;
      }

      if (code === "auth/network-request-failed") {
        throw new Error("Sem conexão com a internet para autenticar no chat.");
      }

      throw signInError;
    }
  })();

  try {
    await pendingAuthPromise;
  } finally {
    pendingAuthPromise = null;
  }
}

const matchesAnyField = (
  targetIdentifier: string,
  fields: unknown[]
): boolean =>
  fields.some((field) => {
    const candidate = pickNonEmptyString(field);
    if (!candidate) {
      return false;
    }
    return resolveIdentifierAlias(candidate) === targetIdentifier;
  });

const buildMemberSession = (
  docId: string,
  docData: FirestoreMemberDoc
): MemberChatSession => {
  const name = pickNonEmptyString(docData.name) ?? "Membro VIP";
  const rawMemberId = pickNonEmptyString(docData.memberId);
  const rawFollowers = pickNonEmptyString(docData.followers);

  const memberId =
    rawMemberId ??
    (rawFollowers ? ensureAtPrefix(rawFollowers) : ensureAtPrefix(normalizeIdentifier(name) || docId));

  const handleSource =
    rawMemberId ??
    (rawFollowers && rawFollowers.startsWith("@") ? rawFollowers : null) ??
    memberId;

  const avatar =
    pickNonEmptyString(docData.image) ?? pickNonEmptyString(docData.avatar);

  return {
    id: docId,
    memberId,
    name,
    handle: ensureAtPrefix(handleSource),
    avatar,
    platform: resolvePrimaryPlatform(docData),
  };
};

export async function authenticateMember(
  identifier: string,
  password: string
): Promise<MemberChatSession> {
  const normalizedInput = normalizeIdentifier(identifier);
  const trimmedPassword = password.trim();

  if (!normalizedInput) {
    throw new Error("Informe o ID ou gamertag do membro.");
  }

  if (!trimmedPassword) {
    throw new Error("Informe a senha do membro.");
  }

  const targetIdentifier = resolveIdentifierAlias(normalizedInput);
  const membersSnapshot = await getDocs(collection(FIREBASE_DB, "members"));

  const docsWithData = membersSnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    data: docSnap.data() as FirestoreMemberDoc,
  }));

  const matchedMember =
    docsWithData.find(({ data }) =>
      matchesAnyField(targetIdentifier, [data.memberId, data.followers])
    ) ??
    docsWithData.find(({ data }) =>
      matchesAnyField(targetIdentifier, [
        data.xboxTag,
        data.playstationTag,
        data.pcTag,
        data.name,
      ])
    );

  if (!matchedMember) {
    throw new Error("Membro não encontrado ou ID inválido.");
  }

  const rawPassword = matchedMember.data.password;
  const hasPassword =
    (typeof rawPassword === "string" || typeof rawPassword === "number") &&
    String(rawPassword).trim().length > 0;

  if (!hasPassword || String(rawPassword) !== trimmedPassword) {
    throw new Error("Senha incorreta para este membro.");
  }

  await ensureFirebaseAuthForMember(matchedMember.id);

  const session = buildMemberSession(matchedMember.id, matchedMember.data);
  await AsyncStorage.setItem(MEMBER_SESSION_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export async function getStoredMemberSession(): Promise<MemberChatSession | null> {
  try {
    const raw = await AsyncStorage.getItem(MEMBER_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<MemberChatSession> | null;
    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      typeof parsed.memberId !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.handle !== "string"
    ) {
      return null;
    }

    const session: MemberChatSession = {
      id: parsed.id,
      memberId: parsed.memberId,
      name: parsed.name,
      handle: parsed.handle,
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : null,
      platform: typeof parsed.platform === "string" ? parsed.platform : "pc",
    };

    ensureFirebaseAuthForMember(session.id).catch(() => {});

    return session;
  } catch {
    return null;
  }
}

export async function logoutMember(): Promise<void> {
  await AsyncStorage.removeItem(MEMBER_SESSION_STORAGE_KEY);
  await signOut(FIREBASE_AUTH).catch(() => {});
}

export function subscribeToChatMessages(
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  const messagesQuery = query(
    collection(FIREBASE_DB, "chatMessages"),
    orderBy("createdAtMs", "asc"),
    limitToLast(CHAT_MESSAGES_LIMIT)
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages: ChatMessage[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        const text = pickNonEmptyString(data.text);

        if (!text) {
          return;
        }

        const timestampObj = data.createdAt as { toMillis?: () => number } | undefined;
        const createdAtMs =
          typeof data.createdAtMs === "number"
            ? data.createdAtMs
            : typeof timestampObj?.toMillis === "function"
              ? timestampObj.toMillis()
              : Date.now();

        messages.push({
          id: docSnap.id,
          text,
          memberDocId:
            typeof data.memberDocId === "string" ? data.memberDocId : undefined,
          memberId: typeof data.memberId === "string" ? data.memberId : "",
          memberName: pickNonEmptyString(data.memberName) ?? "Membro VIP",
          memberHandle: typeof data.memberHandle === "string" ? data.memberHandle : "",
          memberAvatar: pickNonEmptyString(data.memberAvatar),
          platform: pickNonEmptyString(data.platform) ?? "pc",
          createdAtMs,
        });
      });

      onMessages(messages);
    },
    (error) => {
      onError?.(
        error instanceof Error
          ? error
          : new Error("Não foi possível carregar as mensagens do chat.")
      );
    }
  );
}

export async function sendChatMessage(
  session: MemberChatSession,
  text: string
): Promise<void> {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("Digite uma mensagem antes de enviar.");
  }

  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new Error(
      `A mensagem deve ter no máximo ${MAX_CHAT_MESSAGE_LENGTH} caracteres.`
    );
  }

  await ensureFirebaseAuthForMember(session.id);

  await addDoc(collection(FIREBASE_DB, "chatMessages"), {
    text: trimmed,
    memberDocId: session.id,
    memberId: session.memberId,
    memberName: session.name,
    memberHandle: session.handle,
    memberAvatar: session.avatar ?? null,
    platform: session.platform,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
}
