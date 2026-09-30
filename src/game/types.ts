export type LocationId = "home" | "bus_stop" | "work";

export type Command =
  | { readonly type: "travel_to_bus_stop" }
  | { readonly type: "take_bus_to_work" }
  | { readonly type: "negotiate_bus_to_work"; readonly offerNaira: number }
  | { readonly type: "work_shift" };

export interface PlayerState {
  readonly cashNaira: number;
  readonly energy: number;
  readonly timeMinutes: number;
  readonly location: LocationId;
  readonly reputation: number;
  readonly workShiftsCompleted: number;
}

export interface WorldState {
  readonly date: string;
  readonly trafficMinutes: number;
  readonly standardBusFareNaira: number;
  readonly minimumNegotiatedFareNaira: number;
}

export interface StateDelta {
  readonly cashNaira: number;
  readonly energy: number;
  readonly timeMinutes: number;
  readonly location: LocationId | null;
  readonly reputation: number;
  readonly workShiftsCompleted: number;
}

export interface GameEvent {
  readonly type: string;
  readonly message: string;
  readonly command: Command;
  readonly delta: StateDelta;
}

export interface CommandFailure {
  readonly ok: false;
  readonly code:
    | "INVALID_COMMAND"
    | "INSUFFICIENT_FUNDS"
    | "INSUFFICIENT_ENERGY"
    | "WRONG_LOCATION"
    | "INVALID_OFFER"
    | "OUT_OF_TIME"
    | "ACTION_LIMIT_REACHED";
  readonly message: string;
  readonly state: PlayerState;
}

export interface CommandSuccess {
  readonly ok: true;
  readonly state: PlayerState;
  readonly delta: StateDelta;
  readonly event: GameEvent;
}

export type CommandResult = CommandSuccess | CommandFailure;

export const DAY_START_MINUTES = 7 * 60;
export const DAY_END_MINUTES = 22 * 60;

export function createInitialPlayerState(): PlayerState {
  return {
    cashNaira: 10_000,
    energy: 100,
    timeMinutes: DAY_START_MINUTES,
    location: "home",
    reputation: 0,
    workShiftsCompleted: 0,
  };
}

export function createDefaultWorldState(): WorldState {
  return {
    date: "2026-10-01",
    trafficMinutes: 18,
    standardBusFareNaira: 1_200,
    minimumNegotiatedFareNaira: 900,
  };
}
