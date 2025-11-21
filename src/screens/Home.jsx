export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">DeckForge AI</h1>
      <p className="text-muted-foreground mb-6">
        Build better Magic: The Gathering decks with AI-powered insights.
      </p>

      <div className="space-y-4">
        <div className="bg-card border rounded-lg p-4">
          <h2 className="font-bold mb-2">Free Features</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Build unlimited decks</li>
            <li>• Search MTG cards</li>
            <li>• Basic mana curve analysis</li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h2 className="font-bold mb-2">Premium Features</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• AI deck grading</li>
            <li>• Card synergy insights</li>
            <li>• Smart card suggestions</li>
          </ul>
          <p className="text-xs text-primary mt-2">$3.99/mo • 7-day trial</p>
        </div>
      </div>
    </div>
  )
}
