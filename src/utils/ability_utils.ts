import { GameMonster } from '../game_monster';
import { Ability } from '../types';

export const EARTHQUAKE_DAMAGE = 2;
export const RUST_AMOUNT = 2;
export const REDEMPTION_DAMAGE = 1;
export const BACKFIRE_DAMAGE = 2;
export const THORNS_DAMAGE = 2;
export const PROTECT_AMOUNT = 2;
export const CRIPPLE_AMOUNT = 1;
export const WEAKEN_AMOUNT = 1;
export const STRENGTHEN_AMOUNT = 1;
export const LIFE_LEECH_AMOUNT = 1;
export const SCAVENGER_AMOUNT = 1;
export const REPAIR_AMOUNT = 2;
export const TANK_HEAL_MULTIPLIER = 1 / 3;
export const TRIAGE_HEAL_MULTIPLIER = 1 / 3;
export const MINIMUM_TRIAGE_HEAL = 2;
export const MINIMUM_SELF_HEAL = 2;
export const BLAST_MULTIPLIER = 1 / 2;

// https://splinterlands.fandom.com/wiki/Category:Ability
export const AFFLICTION_CHANCE = 1 / 2;
export const RETALIATE_CHANCE = 1 / 2;
export const STUN_CHANCE = 1 / 2;
export const POISON_CHANCE = 1 / 2;
export const POISON_DAMAGE = 2;
export const DODGE_CHANCE = 1 / 2;
export const FLYING_DODGE_CHANCE = 1 / 4;
export const BLIND_DODGE_CHANCE = 1 / 4;
/** Stat multiplier for Last stand */
export const LAST_STAND_MULTIPLIER = 1.5;
/** Stat multiplier for enrage */
export const ENRAGE_MULTIPLIER = 1.5;

/** Abilities that summoner applies to friendly team at the start of the game */
export const SUMMONER_ABILITY_ABILITIES = [
  Ability.AFFLICTION,
  Ability.BLAST,
  Ability.DIVINE_SHIELD,
  Ability.FLYING,
  Ability.LAST_STAND,
  Ability.MAGIC_REFLECT,
  Ability.PIERCING,
  Ability.RETURN_FIRE,
  Ability.SNARE,
  Ability.THORNS,
  Ability.TRUE_STRIKE,
  Ability.VOID,
  Ability.POISON,
];

/** Buffs that summoner applies to friendly team at the start of the game */
export const SUMMONER_BUFF_ABILITIES = [Ability.STRENGTHEN];

/** Abilities that summoner applies to enemy team at the start of the game */
export const SUMMONER_DEBUFF_ABILITIES = [Ability.BLIND];

/** Abilities that monsters apply to friendly team at the start of the game */
export const MONSTER_BUFF_ABILITIES = [
  Ability.AMPLIFY,
  Ability.PROTECT,
  Ability.STRENGTHEN,
  Ability.SWIFTNESS,
  Ability.INSPIRE,
];

/** Abilities that monsters apply to enemy team at the start of the game */
export const MONSTER_DEBUFF_ABILITIES = [
  Ability.AMPLIFY,
  Ability.BLIND,
  Ability.DEMORALIZE,
  Ability.HEADWINDS,
  Ability.RUST,
  Ability.SLOW,
  Ability.SILENCE,
  Ability.WEAKEN,
];

/** Abilities that require a turn to do something */
export const ACTION_ABILITIES = [Ability.REPAIR, Ability.TANK_HEAL];

/**
 * Decrease max hp of the monster by 1.
 */
export function weakenMonster(monster: GameMonster) {
  monster.health = Math.max(monster.health - 1, 1);
}

/** Apply rust to a monster */
export function rustMonster(monster: GameMonster) {
  monster.armor = Math.max(0, monster.armor - RUST_AMOUNT);
}

export function scavengeMonster(monster: GameMonster) {
  monster.addHealth(1);
}

export function tankHealMonster(monster: GameMonster): number {
  if (monster.hasDebuff(Ability.AFFLICTION)) {
    return 0;
  }
  const previousHealth = monster.health;
  const maxHealth = monster.getPostAbilityMaxHealth();
  const healAmount = Math.max(Math.floor(maxHealth * TANK_HEAL_MULTIPLIER), 2);
  monster.addHealth(healAmount);
  return previousHealth - monster.health;
}

export function repairMonsterArmor(monster: GameMonster | null): number {
  if (monster === null) {
    return 0;
  }
  const previousArmor = monster.armor;
  const maxArmor = monster.getPostAbilityMaxArmor();
  const newArmorAmt = Math.min(maxArmor, monster.armor + REPAIR_AMOUNT);
  monster.armor = newArmorAmt;
  return newArmorAmt - previousArmor;
}

export function triageHealMonster(monster: GameMonster | null): number {
  if (monster === null || monster.hasDebuff(Ability.AFFLICTION)) {
    return 0;
  }
  const previousHealth = monster.health;
  const maxHealth = monster.getPostAbilityMaxHealth();
  const healAmt = Math.max(Math.floor(maxHealth * TRIAGE_HEAL_MULTIPLIER), MINIMUM_TRIAGE_HEAL);
  monster.addHealth(healAmt);
  return previousHealth - monster.health;
}

export function selfHeal(self: GameMonster): number {
  if (self.hasDebuff(Ability.AFFLICTION)) {
    return 0;
  }
  const previousHealth = self.health;
  const maxHealth = self.getPostAbilityMaxHealth();
  const healAmount = Math.max(Math.floor(maxHealth / 3), MINIMUM_SELF_HEAL);
  self.addHealth(healAmount);
  return previousHealth - self.health;
}

export function lifeLeechMonster(monster: GameMonster) {
  monster.addHealth(1);
}

export function strengthenMonster(monster: GameMonster) {
  monster.addHealth(1);
}

export function protectMonster(monster: GameMonster) {
  monster.armor = monster.armor + 2;
}

export function resurrectMonster(monster: GameMonster) {
  monster.health = 1;
  monster.armor = monster.startingArmor;
  monster.cleanseDebuffs();
}

export function removeDivineShield(monster: GameMonster) {
  monster.removeAbility(Ability.DIVINE_SHIELD);
}

export function dispelBuffs(monster: GameMonster) {
  const buffsSet = monster.getAllBuffs();
  buffsSet.forEach((value: number, ability: Ability) => {
    if (ability === Ability.SCAVENGER || ability === Ability.LIFE_LEECH) {
      monster.removeBuff(ability);
    }
    monster.removeAllBuff(ability);
  });
}
