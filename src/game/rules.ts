import type { Command, PlayerState, StateDelta, WorldState } from "./types.js";

export interface ActionRule {
  readonly timeMinutes: number;
  readonly cashNaira: number;
  readonly energy: number;
  readonly reputation: number;
  readonly workShiftsCompleted: number;
  readonly destination?: PlayerState["location"];
}

export function resolveRule(command: Command, world: WorldState): ActionRule {
  switch (command.type) {
    case "travel_to_bus_stop":
      return {
        timeMinutes: 15,
        cashNaira: -200,
        energy: -3,
        reputation: 0,
        workShiftsCompleted: 0,
        destination: "bus_stop",
      };

    case "take_bus_to_work":
      return {
        timeMinutes: 35 + world.trafficMinutes,
        cashNaira: -world.standardBusFareNaira,
        energy: -6,
        reputation: 0,
        workShiftsCompleted: 0,
        destination: "work",
      };

    case "negotiate_bus_to_work":
      return {
        timeMinutes: 45 + world.trafficMinutes,
        cashNaira: -command.offerNaira,
        energy: -7,
        reputation: command.offerNaira < world.standardBusFareNaira ? 1 : 0,
        workShiftsCompleted: 0,
        destination: "work",
      };

    case "work_shift":
      return {
        timeMinutes: 240,
        cashNaira: 3_500,
        energy: -22,
        reputation: 1,
        workShiftsCompleted: 1,
      };
  }
}

export function toDelta(
  rule: ActionRule,
  before: PlayerState,
  after: PlayerState,
): StateDelta {
  return {
    cashNaira: after.cashNaira - before.cashNaira,
    energy: after.energy - before.energy,
    timeMinutes: after.timeMinutes - before.timeMinutes,
    location: after.location === before.location ? null : after.location,
    reputation: after.reputation - before.reputation,
    workShiftsCompleted: after.workShiftsCompleted - before.workShiftsCompleted,
  };
}
