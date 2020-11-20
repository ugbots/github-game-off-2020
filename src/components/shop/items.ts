import { Item, Rarity } from '../../model/game/item';

export const imageBannerClasses = (item: Item): readonly string[] => {
  switch (item.rarity) {
    case Rarity.COMMON:
      return ['bg-truegray-500'];
    case Rarity.UNCOMMON:
      return ['bg-green-500'];
    case Rarity.RARE:
      return ['bg-blue-500'];
    case Rarity.EPIC:
      return ['bg-purple-500'];
    case Rarity.LEGENDARY:
      return ['bg-orange-500'];
  }
};

export const quantityString = (quantity: number): string => {
  if (quantity > 0) {
    return `${quantity} owned`;
  }
  return '';
};
