// Mock AI service for deck analysis
// In a real implementation, this would call the OpenAI API

export const analyzeDeck = async (deck, cards) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response based on the deck content
  // We'll generate slightly dynamic data based on the deck name/format to make it feel real

  return {
    score: 85,
    grade: "B+",
    summary: `This ${deck.format} deck has a strong aggressive foundation. The mana curve is low and efficient, allowing for explosive starts.`,
    synergies: [
      {
        name: "Goblin Tribal",
        description:
          "Strong synergy between Goblin Guide and Goblin Chieftain. Your goblin count is high enough to consistently trigger tribal effects.",
        rating: "High",
      },
      {
        name: "Burn Support",
        description:
          "Lightning Bolt provides excellent reach and removal support for your creature base.",
        rating: "Medium",
      },
    ],
    suggestions: [
      {
        name: "Goblin Piledriver",
        reason:
          "Would greatly increase your damage potential in wide board states.",
        add: 2,
        cut: "Mountain",
      },
      {
        name: "Legion Loyalist",
        reason:
          "Provides trample and first strike to your team, making attacks much safer.",
        add: 2,
        cut: "Goblin Guide (1)",
      },
    ],
    matchups: [
      {
        archetype: "Control",
        winRate: "45%",
        notes: "Struggles against board wipes. Need to win fast.",
      },
      {
        archetype: "Midrange",
        winRate: "60%",
        notes: "Can go under their threats effectively.",
      },
      {
        archetype: "Combo",
        winRate: "55%",
        notes: "Race them down before they assemble pieces.",
      },
    ],
    sideboard: [
      "Red Elemental Blast (vs Blue Control)",
      "Tormod's Crypt (vs Graveyard)",
      "Smash to Smithereens (vs Artifacts)",
    ],
  };
};
