import {
  applyCommand,
  createDefaultWorldState,
  createInitialPlayerState,
  type PlayerState,
} from "../src/game/index.js";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

function run(): void {
  const world = createDefaultWorldState();

  equal(
    createInitialPlayerState(),
    {
      cashNaira: 10_000,
      energy: 100,
      timeMinutes: 420,
      location: "home",
      reputation: 0,
    },
    "initial state should be deterministic",
  );

  const start = createInitialPlayerState();
  const toStop = applyCommand(start, world, { type: "travel_to_bus_stop" });
  assert(toStop.ok, "walking to the bus stop should succeed");
  if (!toStop.ok) return;

  equal(
    toStop.delta,
    {
      cashNaira: -200,
      energy: -3,
      timeMinutes: 15,
      location: "bus_stop",
      reputation: 0,
    },
    "travel should produce the expected state delta",
  );

  const toWork = applyCommand(toStop.state, world, {
    type: "negotiate_bus_to_work",
    offerNaira: 900,
  });
  assert(toWork.ok, "a floor-rate negotiation should succeed");
  if (!toWork.ok) return;

  equal(
    toWork.state,
    {
      cashNaira: 8_900,
      energy: 90,
      timeMinutes: 483,
      location: "work",
      reputation: 1,
    },
    "negotiated transport should resolve deterministically",
  );

  const shift = applyCommand(toWork.state, world, { type: "work_shift" });
  assert(shift.ok, "work should succeed after reaching work");
  if (!shift.ok) return;

  equal(
    shift.state,
    {
      cashNaira: 12_400,
      energy: 68,
      timeMinutes: 723,
      location: "work",
      reputation: 2,
    },
    "work should apply the expected reward and resource costs",
  );

  const invalid = applyCommand(start, world, { type: "work_shift" });
  assert(!invalid.ok, "work from home must be rejected");
  if (invalid.ok) return;
  equal(invalid.code, "WRONG_LOCATION", "wrong location should be the failure reason");
  equal(invalid.state, start, "rejected commands must not mutate state");

  const poor: PlayerState = {
    cashNaira: 100,
    energy: 100,
    timeMinutes: 420,
    location: "bus_stop",
    reputation: 0,
  };
  const noCash = applyCommand(poor, world, { type: "take_bus_to_work" });
  assert(!noCash.ok, "insufficient funds should block travel");
  if (noCash.ok) return;
  equal(noCash.code, "INSUFFICIENT_FUNDS", "insufficient funds should be explicit");
  equal(noCash.state, poor, "failed commands preserve state");

  const lowOfferState: PlayerState = {
    cashNaira: 10_000,
    energy: 100,
    timeMinutes: 435,
    location: "bus_stop",
    reputation: 0,
  };
  const lowOffer = applyCommand(lowOfferState, world, {
    type: "negotiate_bus_to_work",
    offerNaira: 500,
  });
  assert(!lowOffer.ok, "offers below the floor should be rejected");
  if (lowOffer.ok) return;
  equal(lowOffer.code, "INVALID_OFFER", "offer rejection should be explicit");
  equal(lowOffer.state, lowOfferState, "rejected offers preserve state");

  const endOfDay = applyCommand(
    (applyCommand(
      (applyCommand(start, world, { type: "travel_to_bus_stop" }) as { ok: true; state: PlayerState }).state,
      world,
      { type: "take_bus_to_work" },
    ) as { ok: true; state: PlayerState }).state,
    world,
    { type: "work_shift" },
  );
  assert(endOfDay.ok, "the standard first-day path should succeed");
  if (!endOfDay.ok) return;
  equal(endOfDay.state.timeMinutes, 717, "first-day path should remain inside 10 PM");
  assert(endOfDay.state.timeMinutes <= 22 * 60, "first-day path must stay within the playable day");

  console.log("HUSTLEVERSE game-engine checks passed.");
}

run();
