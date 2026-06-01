
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const USERS_KEY = "users";
const PROFILES_KEY = "profiles";

const getStoredJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const getProfiles = () => getStoredJson(PROFILES_KEY, {});

const getUsers = () => getStoredJson(USERS_KEY, []);

const buildDefaultProfile = (user) => {
  const savedUser = getUsers().find((item) => item.mobile === user?.mobile);

  return {
    name: savedUser?.name || `${user?.role || "User"} Profile`,
    mobile: user?.mobile || "",
    email: savedUser?.email || "",
    location: savedUser?.location || "",
    businessName: savedUser?.businessName || "",
    businessType: savedUser?.businessType || user?.role || "",
    image: "",
    about: "",
    availability: "Available",
  };
};

const getProfileForUser = (user) => {
  if (!user?.mobile) {
    return null;
  }

  const profiles = getProfiles();
  return profiles[user.mobile] || buildDefaultProfile(user);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (data) => {
    const profile = getProfileForUser(data);
    const userData = { ...data, profile };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = (profileData) => {
    if (!user?.mobile) {
      return;
    }

    const updatedProfile = {
      ...getProfileForUser(user),
      ...profileData,
      mobile: user.mobile,
      businessType: profileData.businessType || user.role,
      updatedAt: new Date().toISOString(),
    };

    const profiles = getProfiles();
    profiles[user.mobile] = updatedProfile;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

    const updatedUser = { ...user, profile: updatedProfile };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
