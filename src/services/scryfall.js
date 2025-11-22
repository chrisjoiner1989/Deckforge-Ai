
const BASE_URL = 'https://api.scryfall.com';

export const searchCards = async (query) => {
  if (!query) return [];
  
  try {
    const response = await fetch(`${BASE_URL}/cards/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    return data.data.map(card => ({
      id: card.id,
      name: card.name,
      type: card.type_line,
      manaCost: card.mana_cost,
      text: card.oracle_text,
      set: card.set_name,
      rarity: card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1),
      imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal,
      colors: card.colors || card.card_faces?.[0]?.colors || [],
      cmc: card.cmc,
      power: card.power,
      toughness: card.toughness,
      flavorText: card.flavor_text,
      price: card.prices?.usd || '0.00'
    }));
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
};
