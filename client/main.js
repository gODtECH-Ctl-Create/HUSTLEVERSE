import {
  applyCommand,
  createDefaultWorldState,
  createInitialPlayerState,
} from "/dist/src/game/index.js";
import { firstDayScenarios } from "/dist/src/game/index.js";

const world = createDefaultWorldState();
let state = createInitialPlayerState();
let history = [];

const elements = {
  cash: document.querySelector("#cash"),
  energy: document.querySelector("#energy"),
  time: document.querySelector("#time"),
  location: document.querySelector("#location"),
  reputation: document.querySelector("#reputation"),
  scenarioTitle: document.querySelector("#scenario-title"),
  scenarioDescription: document.querySelector("#scenario-description"),
  scenarioChip: document.querySelector("#scenario-chip"),
  actions: document.querySelector("#actions"),
  feedback: document.querySelector("#feedback"),
  eventLog: document.querySelector("#event-log"),
  restart: document.querySelector("#restart"),
};

const locationNames = {
  home: "Home",
  bus_stop: "Bus stop",
  work: "Work",
};

const scenarioNames = {
  "morning-departure": "Morning",
  "transport-negotiation": "Transport",
  "work-shift": "Work",
};

function formatMoney(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTime(minutes) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function currentScenario() {
  return firstDayScenarios.find((scenario) =>
    scenario.canStart(state, world)
  ) ?? null;
}

function commandLabel(commandType) {
  switch (commandType) {
    case "travel_to_bus_stop":
      return "Walk to the bus stop";
    case "take_bus_to_work":
      return `Pay ${formatMoney(world.standardBusFareNaira)} and take the bus`;
    case "negotiate_bus_to_work":
      return "Negotiate your fare";
    case "work_shift":
      return "Work your shift";
    default:
      return commandType;
  }
}

function renderActions(scenario) {
  elements.actions.replaceChildren();

  if (!scenario) {
    const done = document.createElement("p");
    done.className = "done-message";
    done.textContent =
      "The first-day slice is complete. You made it through the prototype.";
    elements.actions.append(done);
    return;
  }

  for (const type of scenario.availableCommands) {
    if (type === "negotiate_bus_to_work") {
      const group = document.createElement("div");
      group.className = "negotiation";

      const input = document.createElement("input");
      input.id = "offer";
      input.type = "number";
      input.inputMode = "numeric";
      input.min = String(world.minimumNegotiatedFareNaira);
      input.step = "50";
      input.value = String(world.minimumNegotiatedFareNaira);
      input.setAttribute("aria-label", "Offer in naira");

      const button = document.createElement("button");
      button.className = "button";
      button.type = "button";
      button.textContent = "Make offer";
      button.addEventListener("click", () => {
        const offerNaira = Number(input.value);
        execute({ type, offerNaira });
      });

      group.append(input, button);
      elements.actions.append(group);
      continue;
    }

    const button = document.createElement("button");
    button.className = "button";
    button.type = "button";
    button.textContent = commandLabel(type);
    button.addEventListener("click", () => execute({ type }));
    elements.actions.append(button);
  }
}

function addHistory(message, kind = "event") {
  history = [{ message, kind }, ...history].slice(0, 8);
  renderLog();
}

function renderLog() {
  elements.eventLog.replaceChildren();

  for (const item of history) {
    const entry = document.createElement("li");
    entry.className = `event-entry event-${item.kind}`;
    entry.textContent = item.message;
    elements.eventLog.append(entry);
  }
}

function render() {
  elements.cash.textContent = formatMoney(state.cashNaira);
  elements.energy.textContent = String(state.energy);
  elements.time.textContent = formatTime(state.timeMinutes);
  elements.location.textContent = locationNames[state.location];
  elements.reputation.textContent = String(state.reputation);

  const scenario = currentScenario();
  elements.scenarioTitle.textContent =
    scenario?.title ?? "First day complete";
  elements.scenarioDescription.textContent =
    scenario?.description ??
    "You reached the end of the currently implemented first-day slice.";
  elements.scenarioChip.textContent =
    scenario ? scenarioNames[scenario.id] : "Complete";

  renderActions(scenario);
  renderLog();
}

function execute(command) {
  const result = applyCommand(state, world, command);

  if (!result.ok) {
    elements.feedback.textContent = result.message;
    elements.feedback.className = "feedback feedback-error";
    addHistory(result.message, "error");
    return;
  }

  state = result.state;
  elements.feedback.textContent = result.event.message;
  elements.feedback.className = "feedback feedback-success";
  addHistory(
    `${result.event.message} (${result.delta.timeMinutes} min, ${formatMoney(result.delta.cashNaira)})`,
  );
  render();
}

elements.restart.addEventListener("click", () => {
  state = createInitialPlayerState();
  history = [];
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  addHistory("New day. Same Lagos.", "system");
  render();
});

addHistory("New day. Same Lagos.", "system");
render();
