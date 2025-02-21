import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/register", {
        email,
        password,
        name,
      });
      alert("Register Berhasil: " + response.data.message);
      const userData = {
        email,
        name,
        profilePic: "https://i.pravatar.cc/50",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // navigate("/profile");
    } catch (error) {
      console.log(error);
      alert(
        "Register Gagal: " +
          JSON.stringify(error?.response?.data?.errors || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/login", {
        email,
        password,
      });
      alert("Login Berhasil: " + response.data.message);
      const userData = {
        email,
        name: email,
        profilePic: "https://i.pravatar.cc/50",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(
        "Login Gagal: " +
          JSON.stringify(error?.response?.data?.errors || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/auth/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Gagal mengambil data profil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userId, updateData) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/auth/profile/${userId}`, updateData);
      alert(response.data.message);
      getProfile(userId); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return { user, logout, register, login, loading, getProfile, profile, updateProfile };
}