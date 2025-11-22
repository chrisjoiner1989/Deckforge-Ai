import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Mail, Lock, Loader2, ArrowRight, Key } from 'lucide-react'
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null)

  const { signIn, signUp, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (error) {
      setError(error)
    } else {
      navigate('/decks')
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setEmail('')
    setPassword('')
  }

  const handleOAuthSignIn = async (provider) => {
    setError('')
    setOauthLoading(provider)

    let result
    if (provider === 'google') {
      result = await signInWithGoogle()
    } else if (provider === 'apple') {
      result = await signInWithApple()
    } else if (provider === 'facebook') {
      result = await signInWithFacebook()
    }

    setOauthLoading(null)

    if (result.error) {
      setError(result.error)
    } else {
      navigate('/decks')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background text-foreground">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/20 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-2xl mb-6 shadow-[0_0_40px_rgba(234,88,12,0.3)] border border-white/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Key className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-glow">
            {isLogin ? 'Enter DekForge' : 'Begin Legacy'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isLogin ? 'Enter your credentials to access your vault' : 'Forge your identity and start building'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass p-8 rounded-3xl animate-fade-in-up animation-delay-200 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                <Input
                  type="email"
                  placeholder="wizard@wizards.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all text-lg placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all text-lg placeholder:text-gray-600"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-lg tracking-wide"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? 'Enter DekForge' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-background/50 backdrop-blur px-4 text-gray-500">
                  Or summon with
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:-translate-y-1"
                onClick={() => handleOAuthSignIn('google')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <FaGoogle className="h-5 w-5 text-white" />
                )}
              </Button>
              <Button
                variant="outline"
                className="h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:-translate-y-1"
                onClick={() => handleOAuthSignIn('apple')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'apple' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <FaApple className="h-5 w-5 text-white" />
                )}
              </Button>
              <Button
                variant="outline"
                className="h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:-translate-y-1"
                onClick={() => handleOAuthSignIn('facebook')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'facebook' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <FaFacebook className="h-5 w-5 text-blue-400" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500 animate-fade-in animation-delay-400">
          {isLogin ? "New to the multiverse? " : "Already a planeswalker? "}
          <button
            onClick={toggleMode}
            className="font-bold text-primary hover:text-primary/80 hover:underline transition-all"
          >
            {isLogin ? 'Join the ranks' : 'Access vault'}
          </button>
        </p>
      </div>
    </div>
  )
}
