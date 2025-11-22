import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // You could send error to logging service here
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="glass-card p-8 rounded-2xl border-2 border-destructive/30 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-destructive to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-destructive/30 shadow-lg shadow-destructive/20">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold mb-3">Something Went Wrong</h1>

              <p className="text-muted-foreground mb-6 text-lg">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground mb-2">
                    Error Details (for developers)
                  </summary>
                  <div className="p-4 rounded-lg bg-background/50 border-2 border-primary/10">
                    <p className="text-sm text-destructive font-mono mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-muted-foreground overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="border-2 border-primary/30 hover:bg-card/50 font-semibold"
                >
                  Go Back
                </Button>
                <Button
                  onClick={this.handleReset}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 border-2 border-primary/30"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
