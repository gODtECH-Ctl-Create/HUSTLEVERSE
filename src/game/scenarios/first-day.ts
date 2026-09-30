import type { Command, PlayerState, WorldState } from "../types.js";

export interface Scenario {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly availableCommands: readonly Command["type"][];
  readonly canStart: (state: PlayerState, world: WorldState) => boolean;
}

export const firstDayScenarios: readonly Scenario[] = [
  {
    id: "morning-departure",
    title: "Make It Out",
    description: "You need to leave home and start the day.",
    availableCommands: ["travel_to_bus_stop"],
    canStart: (state) => state.location === "home",
  },
  {
    id: "transport-negotiation",
    title: "How Much Is Transport?",
    description: "The driver quoted a standard fare. You can pay or negotiate.",
    availableCommands: ["take_bus_to_work", "negotiate_bus_to_work"],
    canStart: (state) => state.location === "bus_stop",
  },
  {
    id: "work-shift",
    title: "Clock In",
    description: "You made it to work. Time to earn today's money.",
    availableCommands: ["work_shift"],
    canStart: (state) => state.location === "work" && state.workShiftsCompleted === 0,
  },
];
