import test from "node:test";
import assert from "node:assert/strict";
import {
  applyCommand,
  createDefaultWorldState,
  createInitialPlayerState,
  type PlayerState,
} from "../src/game/index.js";

const world = createDefaultWorldState();

test("initial state starts at home with ₦10,000 and full energy", () => {
  assert.deepEqual(createInitialPlayerState(), {
    cashNaira: 10_000,
    energy: 100,
    timeMinutes: 420,
    location: "home",
    reputation: 0,
  });
});

test("valid commands produce deterministic deltas", () => {
  const start = createInitialPlayerState();

  const toStop = applyCommand(start, world, { type: "travel_to_bus_stop" });
  assert.equal(toStop.ok, true);
  if (!toStop.ok) return;

  assert.deepEqual(toStop.delta, {
    cashNaira: -200,
    energy: -3,
    timeMinutes: 15,
    location: "bus_stop",
    reputation: 0,
  });

  const toWork = applyCommand(toStop.state, world, {
    type: "negotiate_bus_to_work",
    offerNaira: 900,
  });
  assert.equal(toWork.ok, true);
  if (!toWork.ok) return;

  assert.deepEqual(toWork.state, {
    cashNaira: 8_900,
    energy: 90,
    timeMinutes: 483,
    location: "work",
    reputation: 1,
  });

  const shift = applyCommand(toWork.state, world, { type: "work_shift" });
  assert.equal(shift.ok, true);
  if (!shift.ok) return;

  assert.deepEqual(shift.state, {
    cashNaira: 12_400,
    energy: 68,
    timeMinutes: 723,
    location: "work",
    reputation: 2,
  });
});

test("invalid commands do not mutate state", () => {
  const start = createInitialPlayerState();

  const result = applyCommand(start, world, { type: "work_shift" });

  assert.equal(result.ok, false);
  assert.equal(result.code, "WRONG_LOCATION");
  assert.deepEqual(result.state, start);
  assert.equal(start.cashNaira, 10_000);
  assert.equal(start.timeMinutes, 420);
  assert.equal(start.energy, 100);
});

test("insufficient cash blocks transport without changing state", () => {
  const poor: PlayerState = {
    cashNaira: 100,
    energy: 100,
    timeMinutes: 420,
    location: "bus_stop",
    reputation: 0,
  };

  const result = applyCommand(poor, world, { type: "take_bus_to_work" });

  assert.equal(result.ok, false);
  assert.equal(result.code, "INSUFFICIENT_FUNDS");
  assert.deepEqual(result.state, poor);
});

test("offers below the negotiated floor are rejected", () => {
  const state: PlayerState = {
    cashNaira: 10_000,
    energy: 100,
    timeMinutes: 435,
    location: "bus_stop",
    reputation: 0,
  };

  const result = applyCommand(state, world, {
    type: "negotiate_bus_to_work",
    offerNaira: 500,
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, "INVALID_OFFER");
  assert.deepEqual(result.state, state);
});

test("the first-day sequence remains inside the playable day", () => {
  const start = createInitialPlayerState();
  const toStop = applyCommand(start, world, { type: "travel_to_bus_stop" });
  assert.equal(toStop.ok, true);
  if (!toStop.ok) return;

  const toWork = applyCommand(toStop.state, world, {
    type: "take_bus_to_work",
  });
  assert.equal(toWork.ok, true);
  if (!toWork.ok) return;

  const shift = applyCommand(toWork.state, world, { type: "work_shift" });
  assert.equal(shift.ok, true);
  if (!shift.ok) return;

  assert.equal(shift.state.timeMinutes, 717);
  assert.ok(shift.state.timeMinutes <= 22 * 60);
});
