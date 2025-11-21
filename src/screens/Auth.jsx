import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null) // 'google', 'apple', 'facebook', or null

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
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-6 shadow-lg shadow-primary/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Enter your credentials to access your decks' : 'Start building your ultimate deck today'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 rounded-3xl animate-fade-in-up animation-delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/50 backdrop-blur px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl transition-all hover:scale-[1.02]"
                onClick={() => handleOAuthSignIn('google')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FaGoogle className="h-4 w-4 text-red-500" />
                )}
              </Button>
              <Button
                variant="outline"
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl transition-all hover:scale-[1.02]"
                onClick={() => handleOAuthSignIn('apple')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'apple' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FaApple className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                className="h-11 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl transition-all hover:scale-[1.02]"
                onClick={() => handleOAuthSignIn('facebook')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'facebook' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FaFacebook className="h-4 w-4 text-blue-500" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground animate-fade-in animation-delay-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-primary hover:text-primary/80 hover:underline transition-all"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
