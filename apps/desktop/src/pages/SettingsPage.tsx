// ============================================
// 设置页面 - src/pages/SettingsPage.tsx
// ============================================
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Key,
  Trash2,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { handleApiError } from '../api/client';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'security';

interface ContextType {
  resolvedTheme: 'light' | 'dark';
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    hover: string;
    inputBg: string;
    inputBorder: string;
    cardBg: string;
    cardBorder: string;
  };
}

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const { colors } = useOutletContext<ContextType>();

  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
  });

  const tabs = [
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'appearance' as const, icon: Palette, label: 'Appearance' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifications' },
    { id: 'security' as const, icon: Shield, label: 'Security' },
  ];

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // API 调用更新用户信息
      updateUser(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: handleApiError(error) });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full px-4 py-2.5 ${colors.inputBg} ${colors.inputBorder} ${colors.text} rounded-lg focus:outline-none focus:border-primary-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className={`w-full px-4 py-2.5 ${colors.inputBg} ${colors.inputBorder} ${colors.textMuted} rounded-lg cursor-not-allowed`}
                  />
                  <p className={`text-xs ${colors.textMuted} mt-1`}>
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleProfileSave}
              disabled={saving}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>Theme</h3>
              <p className={`text-sm ${colors.textMuted} mb-4`}>
                Choose your preferred theme. System will follow your OS settings.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`p-4 rounded-lg border transition-all ${
                      theme === option.value
                        ? 'border-primary-500 bg-primary-500/10 shadow-sm'
                        : `${colors.cardBorder} ${colors.hover} ${colors.textSecondary}`
                    }`}
                  >
                    <option.icon
                      size={24}
                      className={`mx-auto mb-2 ${
                        theme === option.value ? 'text-primary-400' : colors.textMuted
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        theme === option.value ? 'text-primary-400 font-medium' : colors.text
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 ${colors.cardBg} rounded-lg border ${colors.cardBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <p className={`text-sm ${colors.textMuted}`}>
                  Current resolved theme: <span className="text-primary-400 font-medium capitalize">{resolvedTheme}</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', checked: true },
                  { id: 'push', label: 'Push Notifications', description: 'Receive push notifications', checked: true },
                  { id: 'marketing', label: 'Marketing Emails', description: 'Receive product updates and tips', checked: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 ${colors.cardBg} rounded-lg border ${colors.cardBorder}`}
                  >
                    <div>
                      <p className={`font-medium ${colors.text}`}>{item.label}</p>
                      <p className={`text-sm ${colors.textMuted}`}>{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                      <div className={`w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>Security Settings</h3>
              <div className="space-y-3">
                <button className={`w-full p-4 text-left ${colors.cardBg} ${colors.hover} rounded-lg border ${colors.cardBorder} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Key size={20} className={colors.textMuted} />
                    <div>
                      <p className={`font-medium ${colors.text}`}>Change Password</p>
                      <p className={`text-sm ${colors.textMuted}`}>
                        Update your password regularly for security
                      </p>
                    </div>
                  </div>
                </button>
                <button className={`w-full p-4 text-left ${colors.cardBg} ${colors.hover} rounded-lg border ${colors.cardBorder} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Shield size={20} className={colors.textMuted} />
                    <div>
                      <p className={`font-medium ${colors.text}`}>Two-Factor Authentication</p>
                      <p className={`text-sm ${colors.textMuted}`}>
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                </button>
                <button className={`w-full p-4 text-left ${colors.cardBg} hover:bg-red-500/10 border-red-500/20 hover:border-red-500/20 border rounded-lg transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-red-400" />
                    <div>
                      <p className="font-medium text-red-400">Delete Account</p>
                      <p className={`text-sm ${colors.textMuted}`}>
                        Permanently delete your account and data
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 overflow-auto ${colors.bg} ${colors.text}`}>
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className={colors.textMuted}>Manage your account and preferences</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className={`${colors.cardBg} border ${colors.cardBorder} rounded-xl overflow-hidden`}>
          <div className="flex flex-col lg:flex-row">
            {/* 侧边栏 */}
            <div className={`w-full lg:w-48 ${colors.border} lg:border-r border-b lg:border-b-0`}>
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-1 lg:p-2 space-x-1 lg:space-x-0 lg:space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400'
                        : `${colors.textMuted} ${colors.hover}`
                      }
                    `}
                  >
                    <tab.icon size={18} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 内容区 */}
            <div className="flex-1 p-4 lg:p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
