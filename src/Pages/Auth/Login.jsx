  import React, { useState,useEffect} from 'react';
  import { useNavigate } from 'react-router-dom';
  import { loginUser } from '../../Controllers/authController';
  import { Mail, Lock } from 'lucide-react';
  import { useUser } from '../../context/UserContext'; // Importing UserContext to access user role

  const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user,login } = useUser(); // Get login function from UserContext

    useEffect(() => {
    if (user) {
      setMessage({ type: 'success', text: 'You are logged in. Redirecting...' });

      setTimeout(() => {
        const role = user.role;
        switch (role) {
          case 'admin':
            navigate('/superadmin/dashboard');
            break;
          case 'college':
            navigate('/college/dashboard');
            break;
          case 'trainer':
            navigate('/trainer/dashboard');
            break;
          case 'candidate':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }, 1500); // wait 1.5 seconds before redirecting
    }
  }, [user, navigate]);



    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await loginUser(email, password);
        //console.log('Login result:', result.user.role);
        login(result.user); // Store user in context

        if (result.success) {   
          setMessage({ type: 'success', text: result.message });

          setTimeout(() => {
            const role = result.user?.role;
            switch (role) {
              case 'admin':
                navigate('/admin/dashboard');
                break;
              case 'college':
                navigate('/college/dashboard');
                break;
              case 'trainer':
                navigate('/trainer/dashboard');
                break;
              case 'candidate':
                navigate('/dashboard');
                break;
              default:
                navigate('/dashboard');
            }
          }, 1000);
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch  {
        setMessage({ type: 'error', text: 'Login failed. Please try again.' });
      }

      setLoading(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-teal-100 text-gray-800">
        <div className="relative ring-1 ring-blue-300 bg-white border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/Logo.png" alt="Logo" className="h-14 w-auto" />
          </div>

          <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">LOGIN</h2>

          {message && (
            <div
              className={`text-sm px-4 py-2 mb-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-red-100 border-red-400 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2 accent-blue-600" />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default Login;
