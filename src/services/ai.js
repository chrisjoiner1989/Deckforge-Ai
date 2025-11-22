import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client if key is available
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true 
}) : null;

export const analyzeDeck = async (deck, cards) => {
  // Fallback to mock if no API key
  if (!openai) {
    console.warn("No OpenAI API key found. Using mock data.");
    return mockAnalyzeDeck(deck);
  }

  try {
    const cardList = cards.map(c => `${c.quantity}x ${c.name}`).join('\n');
    
    const prompt = `
      Analyze this Magic: The Gathering deck for the ${deck.format} format.
      Deck Name: ${deck.name}
      
      Card List:
      ${cardList}
      
      Provide a JSON response with the following structure:
      {
        "score": number (0-100),
        "grade": string (e.g., "A", "B+"),
        "summary": string (2-3 sentences),
        "synergies": [{ "name": string, "description": string, "rating": string (High/Medium/Low) }],
        "suggestions": [{ "name": string, "reason": string, "add": number, "cut": string }],
        "matchups": [{ "archetype": string, "winRate": string, "notes": string }],
        "sideboard": [string]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional Magic: The Gathering deck builder and analyst. Provide detailed, competitive insights." }, 
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo", // Using 3.5-turbo for cost/speed, can upgrade to gpt-4
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Fallback to mock on error
    return mockAnalyzeDeck(deck);
  }
};

const mockAnalyzeDeck = async (deck) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response based on the deck content
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

