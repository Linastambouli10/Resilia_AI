import { useNavigate } from 'react-router-dom';
import logo from '../assets/resilia-logo.png';
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#c4f0ed] via-[#c9f4e4] via-[#bef4d5] to-white flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <div className="text-center space-y-12">
          {/* Logo - Large */}
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Resilia-logo.png"
              className="h-40 w-auto drop-shadow-2xl"
            />
          </div>

          {/* Slogan - Big and Bold */}
          <h1 className="text-6xl md:text-7xl font-bold text-[#66CDAA] tracking-tight leading-tight">
            Welcome to Resilia AI
          </h1>

          {/* Description - Large and Prominent */}
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
           A little friend for your thoughts, here to help you pause, reflect, and keep your mind afloat.
          </p>

          {/* CTA Buttons - Larger */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12">
            <button
              onClick={() => navigate('/login')}
              className="px-12 py-4 text-xl bg-gradient-to-r from-[#b2f2c3] to-[#bef4d5] text-gray-800 rounded-xl font-semibold hover:from-[#a0e5b1] hover:to-[#ace5c3] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-4 text-xl bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl border-2 border-[#b2f2c3] transform hover:-translate-y-1"
            >
              Create Account
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-lg text-gray-600 pt-8">
            Don't have an account? Sign up for free and start your journey today!
          </p>
        </div>
      </div>
    </div>
  );
}