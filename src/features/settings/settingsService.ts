import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { auth, db } from "../../services/firebase";

export type AppearanceSettings = {
  theme: "light" | "dark";
  largerText: boolean;
  iconColor: string;
};

export type DataSharingSettings = {
  analyticsSharing: boolean;
  researchParticipation: boolean;
  crashReports: boolean;
  personalizedTips: boolean;
};

export type NotificationSettings = {
  enableAll: boolean;
  batteryAlerts: boolean;
  connectionStatus: boolean;
  milestoneMoments: boolean;
  parentingTips: boolean;
};

export type PrivacySettings = {
  caregiverVisibility: boolean;
  childProgressVisibility: boolean;
  activityHistoryVisibility: boolean;
  personalizedRecommendations: boolean;
};

type UserSettingsDocument = {
  settings?: {
    appearance?: Partial<AppearanceSettings>;
    dataSharing?: Partial<DataSharingSettings>;
    notifications?: Partial<NotificationSettings>;
    privacy?: Partial<PrivacySettings>;
  };
};

const defaultAppearanceSettings: AppearanceSettings = {
  theme: "dark",
  largerText: false,
  iconColor: "#9333EA",
};

const defaultDataSharingSettings: DataSharingSettings = {
  analyticsSharing: true,
  researchParticipation: false,
  crashReports: true,
  personalizedTips: true,
};

const defaultNotificationSettings: NotificationSettings = {
  enableAll: true,
  batteryAlerts: true,
  connectionStatus: false,
  milestoneMoments: true,
  parentingTips: false,
};

const defaultPrivacySettings: PrivacySettings = {
  caregiverVisibility: true,
  childProgressVisibility: true,
  activityHistoryVisibility: true,
  personalizedRecommendations: true,
};

function getUserDocRef(uid: string) {
  return doc(db, "users", uid);
}

function buildAppearanceSettings(docData?: UserSettingsDocument): AppearanceSettings {
  return {
    theme:
      docData?.settings?.appearance?.theme === "light" ? "light" : "dark",
    largerText: Boolean(docData?.settings?.appearance?.largerText),
    iconColor:
      docData?.settings?.appearance?.iconColor || defaultAppearanceSettings.iconColor,
  };
}

function buildDataSharingSettings(docData?: UserSettingsDocument): DataSharingSettings {
  return {
    analyticsSharing:
      docData?.settings?.dataSharing?.analyticsSharing ??
      defaultDataSharingSettings.analyticsSharing,
    researchParticipation:
      docData?.settings?.dataSharing?.researchParticipation ??
      defaultDataSharingSettings.researchParticipation,
    crashReports:
      docData?.settings?.dataSharing?.crashReports ??
      defaultDataSharingSettings.crashReports,
    personalizedTips:
      docData?.settings?.dataSharing?.personalizedTips ??
      defaultDataSharingSettings.personalizedTips,
  };
}

function buildNotificationSettings(docData?: UserSettingsDocument): NotificationSettings {
  const batteryAlerts =
    docData?.settings?.notifications?.batteryAlerts ??
    defaultNotificationSettings.batteryAlerts;
  const connectionStatus =
    docData?.settings?.notifications?.connectionStatus ??
    defaultNotificationSettings.connectionStatus;
  const milestoneMoments =
    docData?.settings?.notifications?.milestoneMoments ??
    defaultNotificationSettings.milestoneMoments;
  const parentingTips =
    docData?.settings?.notifications?.parentingTips ??
    defaultNotificationSettings.parentingTips;
  const derivedEnableAll =
    batteryAlerts && connectionStatus && milestoneMoments && parentingTips;

  return {
    enableAll:
      docData?.settings?.notifications?.enableAll ?? derivedEnableAll,
    batteryAlerts,
    connectionStatus,
    milestoneMoments,
    parentingTips,
  };
}

function buildPrivacySettings(docData?: UserSettingsDocument): PrivacySettings {
  return {
    caregiverVisibility:
      docData?.settings?.privacy?.caregiverVisibility ??
      defaultPrivacySettings.caregiverVisibility,
    childProgressVisibility:
      docData?.settings?.privacy?.childProgressVisibility ??
      defaultPrivacySettings.childProgressVisibility,
    activityHistoryVisibility:
      docData?.settings?.privacy?.activityHistoryVisibility ??
      defaultPrivacySettings.activityHistoryVisibility,
    personalizedRecommendations:
      docData?.settings?.privacy?.personalizedRecommendations ??
      defaultPrivacySettings.personalizedRecommendations,
  };
}

export async function ensureAppearanceSettings(uid: string) {
  await setDoc(
    getUserDocRef(uid),
    {
      settings: {
        appearance: defaultAppearanceSettings,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function ensureDataSharingSettings(uid: string) {
  await setDoc(
    getUserDocRef(uid),
    {
      settings: {
        dataSharing: defaultDataSharingSettings,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function ensureNotificationSettings(uid: string) {
  await setDoc(
    getUserDocRef(uid),
    {
      settings: {
        notifications: defaultNotificationSettings,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function ensurePrivacySettings(uid: string) {
  await setDoc(
    getUserDocRef(uid),
    {
      settings: {
        privacy: defaultPrivacySettings,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useAppearanceSettings() {
  const [settings, setSettings] = useState<AppearanceSettings>(
    defaultAppearanceSettings
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeSettings: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeSettings?.();

      if (!user) {
        setSettings(defaultAppearanceSettings);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await ensureAppearanceSettings(user.uid);
      } catch (settingsError) {
        setError(
          settingsError instanceof Error
            ? settingsError.message
            : "Failed to initialize appearance settings."
        );
      }

      unsubscribeSettings = onSnapshot(
        getUserDocRef(user.uid),
        (snapshot) => {
          setSettings(buildAppearanceSettings(snapshot.data() as UserSettingsDocument));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load appearance settings.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeSettings?.();
      unsubscribeAuth();
    };
  }, []);

  return { settings, loading, error };
}

export async function saveAppearanceSettings(
  input: Partial<AppearanceSettings>
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to update appearance settings.");
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      settings: {
        appearance: input,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useDataSharingSettings() {
  const [settings, setSettings] = useState<DataSharingSettings>(
    defaultDataSharingSettings
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeSettings: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeSettings?.();

      if (!user) {
        setSettings(defaultDataSharingSettings);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await ensureDataSharingSettings(user.uid);
      } catch (settingsError) {
        setError(
          settingsError instanceof Error
            ? settingsError.message
            : "Failed to initialize data sharing settings."
        );
      }

      unsubscribeSettings = onSnapshot(
        getUserDocRef(user.uid),
        (snapshot) => {
          setSettings(buildDataSharingSettings(snapshot.data() as UserSettingsDocument));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load data sharing settings.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeSettings?.();
      unsubscribeAuth();
    };
  }, []);

  return { settings, loading, error };
}

export async function saveDataSharingSettings(
  input: Partial<DataSharingSettings>
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to update data sharing settings.");
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      settings: {
        dataSharing: input,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(
    defaultNotificationSettings
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeSettings: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeSettings?.();

      if (!user) {
        setSettings(defaultNotificationSettings);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await ensureNotificationSettings(user.uid);
      } catch (settingsError) {
        setError(
          settingsError instanceof Error
            ? settingsError.message
            : "Failed to initialize notification settings."
        );
      }

      unsubscribeSettings = onSnapshot(
        getUserDocRef(user.uid),
        (snapshot) => {
          setSettings(buildNotificationSettings(snapshot.data() as UserSettingsDocument));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load notification settings.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeSettings?.();
      unsubscribeAuth();
    };
  }, []);

  return { settings, loading, error };
}

export async function saveNotificationSettings(
  input: Partial<NotificationSettings>
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to update notification settings.");
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      settings: {
        notifications: input,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function usePrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>(
    defaultPrivacySettings
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeSettings: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeSettings?.();

      if (!user) {
        setSettings(defaultPrivacySettings);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await ensurePrivacySettings(user.uid);
      } catch (settingsError) {
        setError(
          settingsError instanceof Error
            ? settingsError.message
            : "Failed to initialize privacy settings."
        );
      }

      unsubscribeSettings = onSnapshot(
        getUserDocRef(user.uid),
        (snapshot) => {
          setSettings(buildPrivacySettings(snapshot.data() as UserSettingsDocument));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load privacy settings.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeSettings?.();
      unsubscribeAuth();
    };
  }, []);

  return { settings, loading, error };
}

export async function savePrivacySettings(
  input: Partial<PrivacySettings>
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to update privacy settings.");
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      settings: {
        privacy: input,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
