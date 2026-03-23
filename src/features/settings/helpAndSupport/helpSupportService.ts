import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { auth, db } from "../../../services/firebase";

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  createdAtLabel: string;
};

export type SupportChatMessage = {
  id: string;
  sender: "Support" | "You";
  body: string;
  createdAtLabel: string;
};

type SupportTicketDocument = {
  subject?: string;
  message?: string;
  status?: "open" | "closed";
  createdAt?: { toDate?: () => Date };
};

type SupportChatDocument = {
  sender?: "Support" | "You";
  body?: string;
  createdAt?: { toDate?: () => Date };
};

function formatDateLabel(input?: { toDate?: () => Date }) {
  const date = input?.toDate?.();

  if (!date) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getTicketsCollection(uid: string) {
  return collection(db, "users", uid, "supportTickets");
}

function getChatCollection(uid: string) {
  return collection(db, "users", uid, "supportChatMessages");
}

function mapTicket(
  snapshot: QueryDocumentSnapshot<SupportTicketDocument>
): SupportTicket {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    subject: data.subject ?? "Untitled request",
    message: data.message ?? "",
    status: data.status ?? "open",
    createdAtLabel: formatDateLabel(data.createdAt),
  };
}

function mapChatMessage(
  snapshot: QueryDocumentSnapshot<SupportChatDocument>
): SupportChatMessage {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    sender: data.sender ?? "Support",
    body: data.body ?? "",
    createdAtLabel: formatDateLabel(data.createdAt),
  };
}

async function seedSupportChatIfNeeded(uid: string) {
  const messagesQuery = query(getChatCollection(uid), limit(1));
  const snapshot = await getDocs(messagesQuery);

  if (!snapshot.empty) {
    return;
  }

  await addDoc(getChatCollection(uid), {
    sender: "Support",
    body: "Hello. Tell us what issue you hit while using the app.",
    createdAt: serverTimestamp(),
  });
}

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeTickets: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeTickets?.();

      if (!user) {
        setTickets([]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      const ticketsQuery = query(
        getTicketsCollection(user.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribeTickets = onSnapshot(
        ticketsQuery,
        (snapshot) => {
          setTickets(snapshot.docs.map(mapTicket));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load support requests.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeTickets?.();
      unsubscribeAuth();
    };
  }, []);

  return { tickets, loading, error };
}

export function useSupportChat() {
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeChat: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeChat?.();

      if (!user) {
        setMessages([]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        await seedSupportChatIfNeeded(user.uid);
      } catch (seedError) {
        setError(
          seedError instanceof Error
            ? seedError.message
            : "Failed to initialize support chat."
        );
      }

      const chatQuery = query(getChatCollection(user.uid), orderBy("createdAt", "asc"));

      unsubscribeChat = onSnapshot(
        chatQuery,
        (snapshot) => {
          setMessages(snapshot.docs.map(mapChatMessage));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load chat messages.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeChat?.();
      unsubscribeAuth();
    };
  }, []);

  return { messages, loading, error };
}

export function useSupportOverview() {
  const { tickets, loading, error } = useSupportTickets();

  const openTickets = tickets.filter((ticket) => ticket.status === "open").length;
  const latestTicket = tickets[0] ?? null;

  return { tickets, loading, error, openTickets, latestTicket };
}

export async function submitSupportEmail(subject: string, message: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to contact support.");
  }

  await addDoc(getTicketsCollection(user.uid), {
    channel: "email",
    subject: subject.trim(),
    message: message.trim(),
    status: "open",
    createdAt: serverTimestamp(),
  });
}

export async function sendSupportChatMessage(body: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to send a chat message.");
  }

  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new Error("Message cannot be empty.");
  }

  await addDoc(getChatCollection(user.uid), {
    sender: "You",
    body: trimmedBody,
    createdAt: serverTimestamp(),
  });

  await addDoc(getChatCollection(user.uid), {
    sender: "Support",
    body: "Thanks for reaching out. Our support team has received your message and will follow up shortly.",
    createdAt: serverTimestamp(),
  });
}
