import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'Required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Min 6 characters';
    else if (formData.newPassword === formData.currentPassword) newErrors.newPassword = 'Must be different';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Required';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'No match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const result = await changePassword(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '', width: '0%' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (strength <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 4) return { level: 2, label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { level: 3, label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // Success State
  if (isSuccess) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative">
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-8">
            <img src="/images/logoThree.png" alt="Logo" className="w-48 h-auto object-contain mb-4" />
            <h1 className="text-2xl font-bold text-white text-center">Password Changed!</h1>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-500 text-sm mb-4">Your password has been changed.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Redirecting...</span>
              </div>
              <Link to="/admin/dashboard" className="block w-full py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-8">
          <img src="/images/logoThree.png" alt="Logo" className="w-48 h-auto object-contain mb-4 drop-shadow-2xl" />
          <h1 className="text-2xl font-bold text-white text-center mb-2">Change Password</h1>
          <p className="text-blue-100 text-center text-sm max-w-xs">Keep your account secure</p>
          {/* Tips */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs">
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Security Tips
            </h3>
            <ul className="text-blue-100 text-xs space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Mix uppercase & lowercase</li>
              <li>• Include numbers & symbols</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-4">
            <img src="/images/logoThree.png" alt="Logo" className="w-20 h-auto object-contain mx-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Update Password</h2>
              {user && <p className="text-gray-400 text-xs mt-1">{user.email || user.userName}</p>}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={formData.currentPassword} onChange={handleChange}
                    placeholder="Current password" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className={`auth-form-input block w-full px-3 py-2 pr-10 text-sm border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`} />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCurrentPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                  </button>
                </div>
                {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center"><span className="px-2 bg-white text-xs text-gray-400">New Password</span></div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange}
                    placeholder="New password" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className={`auth-form-input block w-full px-3 py-2 pr-10 text-sm border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`} />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                  </button>
                </div>
                {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
                {formData.newPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} transition-all`} style={{ width: passwordStrength.width }} />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.level === 1 ? 'text-red-600' : passwordStrength.level === 2 ? 'text-yellow-600' : 'text-green-600'}`}>{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Confirm password" style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className={`auth-form-input block w-full px-3 py-2 pr-10 text-sm border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                {formData.confirmPassword && formData.newPassword && (
                  <p className={`mt-1 text-xs ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.newPassword === formData.confirmPassword ? '✓ Match' : '✗ No match'}
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md">
                {isSubmitting ? <LoadingSpinner size="sm" /> : <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Update Password
                </>}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <Link to="/admin/dashboard" className="text-xs text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
