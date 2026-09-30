import {
  DAY_END_MINUTES,
  type Command,
  type CommandFailure,
  type CommandResult,
  type GameEvent,
  type PlayerState,
  type WorldState,
} from "./types.js";
import { resolveRule, toDelta } from "./rules.js";

function failure(
  code: CommandFailure["code"],
  message: string,
  state: PlayerState,
): CommandFailure {
  return { ok: false, code, message, state };
}

function commandLabel(command: Command): string {
  switch (command.type) {
    case "travel_to_bus_stop":
      return "Walk to the bus stop";
    case "take_bus_to_work":
      return "Take the bus to work";
    case "negotiate_bus_to_work":
      return "Negotiate the bus fare";
    case "work_shift":
      return "Work a shift";
  }
}

export function applyCommand(
  state: PlayerState,
  world: WorldState,
  command: Command,
): CommandResult {
  if (
    command.type === "travel_to_bus_stop" &&
    state.location !== "home"
  ) {
    return failure("WRONG_LOCATION", "You need to be at home before heading to the bus stop.", state);
  }

  if (
    (command.type === "take_bus_to_work" || command.type === "negotiate_bus_to_work") &&
    state.location !== "bus_stop"
  ) {
    return failure("WRONG_LOCATION", "You need to be at the bus stop before taking a bus to work.", state);
  }

  if (command.type === "work_shift" && state.location !== "work") {
    return failure("WRONG_LOCATION", "You need to reach work before starting a shift.", state);
  }

  if (command.type === "work_shift" && state.workShiftsCompleted >= 1) {
    return failure("ACTION_LIMIT_REACHED", "Today's work shift has already been completed.", state);
  }

  if (
    command.type === "negotiate_bus_to_work" &&
    (command.offerNaira < world.minimumNegotiatedFareNaira ||
      !Number.isInteger(command.offerNaira))
  ) {
    return failure(
      "INVALID_OFFER",
      `The driver will not consider an offer below ₦${world.minimumNegotiatedFareNaira.toLocaleString()}.`,
      state,
    );
  }

  const rule = resolveRule(command, world);

  if (state.cashNaira + rule.cashNaira < 0) {
    return failure("INSUFFICIENT_FUNDS", "You do not have enough cash for that move.", state);
  }

  if (state.energy + rule.energy < 0) {
    return failure("INSUFFICIENT_ENERGY", "You are too tired to do that right now.", state);
  }

  if (state.timeMinutes + rule.timeMinutes > DAY_END_MINUTES) {
    return failure("OUT_OF_TIME", "That action would push the day past 10:00 PM.", state);
  }

  const after: PlayerState = {
    cashNaira: state.cashNaira + rule.cashNaira,
    energy: state.energy + rule.energy,
    timeMinutes: state.timeMinutes + rule.timeMinutes,
    location: rule.destination ?? state.location,
    reputation: state.reputation + rule.reputation,
    workShiftsCompleted: state.workShiftsCompleted + rule.workShiftsCompleted,
  };

  const delta = toDelta(rule, state, after);
  const event: GameEvent = {
    type: command.type,
    message: command.type === "negotiate_bus_to_work"
      ? `You offered ₦${command.offerNaira.toLocaleString()} and the driver accepted.`
      : `${commandLabel(command)} completed.`,
    command,
    delta,
  };

  return { ok: true, state: after, delta, event };
}
