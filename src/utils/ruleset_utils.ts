import { GameMonster } from '../game_monster';
import { GameSummoner } from '../game_summoner';
import { GameTeam } from '../game_team';
import { Ability, Ruleset } from '../types';
import { EARTHQUAKE_DAMAGE } from './ability_utils';
import { hitMonsterWithPhysical } from './damage_utils';

export function doRulesetPreGameBuff(rulesets: Set<Ruleset>, team1: GameTeam, team2: GameTeam) {
  if (rulesets.has(Ruleset.ARMORED_UP)) {
    applyToBothTeamMonsters(team1, team2, applyArmorUpRuleset);
  }
  if (rulesets.has(Ruleset.BACK_TO_BASICS)) {
    applyToBothTeamMonsters(team1, team2, applyBackToBasicsRuleset);
  }
  if (rulesets.has(Ruleset.CLOSE_RANGE)) {
    applyToBothTeamMonsters(team1, team2, applyCloseRangeRuleset);
  }
  if (rulesets.has(Ruleset.EQUAL_OPPORTUNITY)) {
    applyToBothTeamMonsters(team1, team2, applyEqualOpportunity);
  }
  if (rulesets.has(Ruleset.EQUALIZER)) {
    applyEqualizer(team1, team2);
  }
  if (rulesets.has(Ruleset.EXPLOSIVE_WEAPONRY)) {
    applyToBothTeamMonsters(team1, team2, applyExplosiveWeaponry);
  }
  if (rulesets.has(Ruleset.FOG_OF_WAR)) {
    applyToBothTeamMonsters(team1, team2, applyFogOfWar);
  }
  if (rulesets.has(Ruleset.HEALED_OUT)) {
    applyToBothTeamMonsters(team1, team2, applyHealedOut);
  }
  if (rulesets.has(Ruleset.HEAVY_HITTERS)) {
    applyToBothTeamMonsters(team1, team2, applyHeavyHitters);
  }
  if (rulesets.has(Ruleset.HOLY_PROTECTION)) {
    applyToBothTeamMonsters(team1, team2, applyHolyProtection);
  }
  if (rulesets.has(Ruleset.MELEE_MAYHEM)) {
    applyToBothTeamMonsters(team1, team2, applyMeleeMayhem);
  }
  if (rulesets.has(Ruleset.NOXIOUS_FUMES)) {
    applyToBothTeamMonsters(team1, team2, applyNoxiousFumes);
  }
  if (rulesets.has(Ruleset.SILENCED_SUMMONERS)) {
    applySilencedSummoners(team1, team2);
  }
  if (rulesets.has(Ruleset.SPREADING_FURY)) {
    applyToBothTeamMonsters(team1, team2, applySpreadingFury);
  }
  if (rulesets.has(Ruleset.SUPER_SNEAK)) {
    applyToBothTeamMonsters(team1, team2, applySuperSneak);
  }
  if (rulesets.has(Ruleset.WEAK_MAGIC)) {
    applyToBothTeamMonsters(team1, team2, applyWeakMagic);
  }
  if (rulesets.has(Ruleset.TARGET_PRACTICE)) {
    applyToBothTeamMonsters(team1, team2, applyTargetPractice);
  }
}

export function doRulesetPreGamePostBuff(rulesets: Set<Ruleset>, team1: GameTeam, team2: GameTeam) {
  if (rulesets.has(Ruleset.UNPROTECTED)) {
    applyToBothTeamMonsters(team1, team2, applyUnprotected);
  }
}

function applyToBothTeamMonsters(
  team1: GameTeam,
  team2: GameTeam,
  fn: (monster: GameMonster) => void,
) {
  team1.getMonstersList().forEach(fn);
  team2.getMonstersList().forEach(fn);
}

/* Ruleset functions */

// + 2 armor
function applyArmorUpRuleset(monster: GameMonster) {
  monster.addSummonerArmor(2);
}

// No abilities
function applyBackToBasicsRuleset(monster: GameMonster) {
  monster.removeAllAbilities();
}

// Ranged units can be used in the front
function applyCloseRangeRuleset(monster: GameMonster) {
  monster.addAbility(Ability.CLOSE_RANGE);
}

/** Do 2 physical damage to monsters that don't have flying ability */
export function applyEarthquake(monster: GameMonster) {
  if (!monster.hasAbility(Ability.FLYING) || monster.hasDebuff(Ability.SNARE)) {
    hitMonsterWithPhysical(monster, EARTHQUAKE_DAMAGE);
  }
}

/**
 * All monsters have Opportunity.
 */
function applyEqualOpportunity(monster: GameMonster) {
  if (!monster.hasAbility(Ability.SNEAK) && !monster.hasAbility(Ability.SNIPE)) {
    monster.addAbility(Ability.OPPORTUNITY);
  }
}

/** All monsters have health equal to the highest hp monster in the game */
function applyEqualizer(team1: GameTeam, team2: GameTeam) {
  const allMonsters = team1.getMonstersList().concat(team2.getMonstersList());
  let highestHp = 0;
  allMonsters.forEach((monster) => (highestHp = Math.max(monster.health, highestHp)));
  allMonsters.forEach((monster) => {
    monster.health = highestHp;
    monster.startingHealth = highestHp;
  });
}

/** All monsters have blast */
function applyExplosiveWeaponry(monster: GameMonster) {
  monster.addAbility(Ability.BLAST);
}

/** No sneak or snipe */
function applyFogOfWar(monster: GameMonster) {
  monster.removeAbility(Ability.SNEAK);
  monster.removeAbility(Ability.SNIPE);
}

/** No healing abilities */
function applyHealedOut(monster: GameMonster) {
  monster.removeAbility(Ability.TANK_HEAL);
  monster.removeAbility(Ability.HEAL);
  monster.removeAbility(Ability.TRIAGE);
}

/** All monsters have Knock Out */
function applyHeavyHitters(monster: GameMonster) {
  monster.addAbility(Ability.KNOCK_OUT);
}

/** All monsters have holy protection */
function applyHolyProtection(monster: GameMonster) {
  monster.addAbility(Ability.DIVINE_SHIELD);
}

/** Monsters can attack from any position */
function applyMeleeMayhem(monster: GameMonster) {
  monster.addAbility(Ability.MELEE_MAYHEM);
}

/** All monsters poisoned */
function applyNoxiousFumes(monster: GameMonster) {
  monster.addDebuff(Ability.POISON);
}

/** Summoners don't do anything */
function applySilencedSummoners(team1: GameTeam, team2: GameTeam) {
  silenceSummoner(team1.getSummoner());
  silenceSummoner(team2.getSummoner());
}

function silenceSummoner(summoner: GameSummoner) {
  summoner.abilities.clear();
  summoner.health = 0;
  summoner.armor = 0;
  summoner.speed = 0;
  summoner.melee = 0;
  summoner.ranged = 0;
  summoner.magic = 0;
}

/** All monsters have enrage */
function applySpreadingFury(monster: GameMonster) {
  monster.addAbility(Ability.ENRAGE);
}

/**
 * All melee monsters have sneak
 */
function applySuperSneak(monster: GameMonster) {
  if (monster.melee > 0) {
    monster.addAbility(Ability.SNEAK);
  }
}

/** All monsters have void armor */
function applyWeakMagic(monster: GameMonster) {
  monster.addAbility(Ability.VOID_ARMOR);
}

/**
 * All ranged and magic have snipe
 */
function applyTargetPractice(monster: GameMonster) {
  if (monster.ranged > 0 || monster.magic > 0) {
    monster.addAbility(Ability.SNIPE);
  }
}

/**
 * Monsters don't have armor.
 */
function applyUnprotected(monster: GameMonster) {
  monster.armor = 0;
  monster.startingArmor = -99;
}
