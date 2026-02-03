// ============================================
// 登录页面 - src/pages/LoginPage.tsx
// 乳白色暖色调主题 - 左右布局
// ============================================
import { ChevronRight, Loader2, Lock, Mail, Monitor, QrCode, Smartphone, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<'qrcode' | 'form'>('form');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('密码不匹配');
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showQrcode = () => {
    setActiveTab('qrcode');
  };

  const showForm = () => {
    setActiveTab('form');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-100  p-4 relative">
      {/* 顶部 Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          KAIE
        </h1>
      </div>

      {/* 右上角切换按钮 */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={showForm}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'form'
            ? 'bg-primary-100 text-primary-700 border border-primary-200'
            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
        >
          <Monitor size={18} />
          <span className="text-sm font-medium">账号登录</span>
        </button>
        <button
          onClick={showQrcode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'qrcode'
            ? 'bg-primary-100 text-primary-700 border border-primary-200'
            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
        >
          <Smartphone size={18} />
          <span className="text-sm font-medium">扫码登录</span>
        </button>
      </div>

      {/* 主容器 - 左右布局 */}
      <div className="w-full max-w-5xl">
        {activeTab === 'form' ? (
          /* ==================== 账号登录/注册表单 ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 左侧：品牌信息 */}
            <div className="hidden lg:block text-center lg:text-left space-y-4">
              <div className="inline-block p-4 bg-white rounded-xl shadow-sm">
                <QrCode size={80} className="text-primary-500 mx-auto lg:mx-0" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                欢迎使用 <span className="text-primary-500">KAIE</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-md">
                统一的 AI 推理服务管理平台，支持多模型接入与智能调度
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-6">
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">Electron</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">React</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">NestJS</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">TypeScript</span>
              </div>
            </div>

            {/* 右侧：表单卡片 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-primary-200/30">
              {/* 移动端显示 Logo */}
              <div className="lg:hidden text-center mb-6">
                <QrCode size={48} className="text-primary-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800">账号登录</h2>
              </div>

              <h2 className="hidden lg:block text-2xl font-semibold text-center mb-2 text-gray-800">
                {isLogin ? '欢迎回来' : '创建账户'}
              </h2>
              <p className="hidden lg:block text-center text-gray-500 text-sm mb-6">
                {isLogin ? '请登录您的账户' : '注册新账户开始使用'}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      姓名
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                        placeholder="请输入姓名"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    邮箱
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    密码
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                      placeholder="请输入密码"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      确认密码
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                        placeholder="请确认密码"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary-200/50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {isLogin ? '登录中...' : '创建账户中...'}
                    </>
                  ) : isLogin ? (
                    <>
                      登录
                      <ChevronRight size={18} />
                    </>
                  ) : (
                    <>
                      创建账户
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm text-gray-500 hover:text-primary-500 transition-colors inline-flex items-center gap-1"
                >
                  {isLogin ? (
                    <>没有账户？<span className="text-primary-500">立即注册</span></>
                  ) : (
                    <>已有账户？<span className="text-primary-500">立即登录</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== 扫码登录界面 ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 左侧：扫码区域 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-primary-200/30">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Smartphone size={32} className="text-primary-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">扫码登录</h2>
                <p className="text-gray-500 text-sm mb-6">请使用 KAIE 客户端扫描二维码</p>

                {/* 二维码占位区域 */}
                <div className="bg-white rounded-xl p-6 mx-auto w-64 h-64 flex items-center justify-center mb-4 shadow-inner">
                  <div className="text-center">
                    <QrCode size={120} className="text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mt-2">二维码加载中...</p>
                  </div>
                </div>

                <p className="text-gray-400 text-xs">
                  打开 KAIE 客户端 &gt; 点击右上角扫码图标
                </p>
              </div>
            </div>

            {/* 右侧：扫码说明 */}
            <div className="hidden lg:block text-center lg:text-left space-y-6">
              <div className="inline-block p-4 bg-white rounded-xl shadow-sm">
                <Monitor size={80} className="text-primary-500 mx-auto lg:mx-0" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                快捷 <span className="text-primary-500">安全</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-md">
                无需输入账号密码，扫码即可快速登录
              </p>

              {/* 功能特性 */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 text-sm">✓</span>
                  </div>
                  <span>免输入，更便捷</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 text-sm">✓</span>
                  </div>
                  <span>二维码动态加密，更安全</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 text-sm">✓</span>
                  </div>
                  <span>支持多设备同时登录</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={showForm}
                  className="text-primary-500 hover:text-primary-600 text-sm inline-flex items-center gap-1"
                >
                  使用账号密码登录
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* 移动端显示返回按钮 */}
            <div className="lg:hidden text-center mt-6">
              <button
                onClick={showForm}
                className="text-primary-500 hover:text-primary-600 text-sm inline-flex items-center gap-1"
              >
                <ChevronRight size={14} />
                使用账号密码登录
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <p className="absolute bottom-4 text-center text-gray-400 text-xs">
        Powered by Electron + React + NestJS + TypeScript
      </p>
    </div>
  );
}
