"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Trophy,
  TrendingUp,
  Target,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  country?: string;
  trading_experience?: string;
  bio?: string;
  avatar_url?: string;
}

interface TraderStats {
  total_trades: number;
  win_rate: number;
  best_trade: number;
  worst_trade: number;
  total_pnl: number;
  monthly_avg_return: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: "user_123",
    email: "trader@example.com",
    full_name: "John Trader",
    phone: "+1 (555) 123-4567",
    country: "United States",
    trading_experience: "3 years",
    bio: "Professional trader focused on options and futures strategies.",
  });

  const [stats] = useState<TraderStats>({
    total_trades: 247,
    win_rate: 62,
    best_trade: 5400,
    worst_trade: -1200,
    total_pnl: 18500,
    monthly_avg_return: 4.2,
  });

  const [formData, setFormData] = useState(profile);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", profile.id);

      if (error) throw error;

      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center border-2 border-green-400">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-green-100">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Trades</p>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-100">
              {stats.total_trades}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Win Rate</p>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-gray-100">
              {stats.win_rate}%
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total P&L</p>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <p className={`text-3xl font-bold ${stats.total_pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${stats.total_pnl.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Trading Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Trading Experience
                </label>
                <select
                  value={formData.trading_experience || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, trading_experience: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                >
                  <option value="">Select experience level</option>
                  <option value="less_1_year">Less than 1 year</option>
                  <option value="1_3_years">1-3 years</option>
                  <option value="3_5_years">3-5 years</option>
                  <option value="5_plus_years">5+ years</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-green-500"
                  placeholder="Tell us about your trading style..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display Mode */}
              <div>
                <p className="text-gray-400 text-sm mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-100">
                  {profile.full_name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-400 text-sm">Email</p>
                  </div>
                  <p className="text-gray-100">{profile.email}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-400 text-sm">Phone</p>
                  </div>
                  <p className="text-gray-100">{profile.phone || "Not provided"}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-400 text-sm">Country</p>
                  </div>
                  <p className="text-gray-100">{profile.country || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Trading Experience</p>
                  <p className="text-gray-100">{profile.trading_experience || "Not specified"}</p>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">About</p>
                  <p className="text-gray-100">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Advanced Stats */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Trading Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Best Trade</p>
              <p className="text-2xl font-bold text-green-400">
                +${stats.best_trade.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Worst Trade</p>
              <p className="text-2xl font-bold text-red-400">
                ${stats.worst_trade.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Monthly Avg Return</p>
              <p className="text-2xl font-bold text-blue-400">
                {stats.monthly_avg_return.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Total P&L</p>
              <p className="text-2xl font-bold text-green-400">
                +${stats.total_pnl.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Settings & Actions */}
        <div className="space-y-4">
          <button className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Account Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
