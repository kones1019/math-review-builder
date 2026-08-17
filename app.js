const form = document.querySelector("#generator-form");
const gradeEl = document.querySelector("#grade-level");
const topicEl = document.querySelector("#focus-topic");
const countEl = document.querySelector("#question-count");
const typeEl = document.querySelector("#question-type");
const problemsEl = document.querySelector("#problems");
const titleEl = document.querySelector("#worksheet-title");
const problemSummaryEl = document.querySelector("#problem-summary");
const sourceSummaryEl = document.querySelector("#source-summary");
const typeSummaryEl = document.querySelector("#type-summary");
const answerKeyPanel = document.querySelector("#answer-key-panel");
const answerKeyEl = document.querySelector("#answer-key");
const toggleAnswersButton = document.querySelector("#toggle-answers");
const hideAnswersButton = document.querySelector("#hide-answers");
const printButton = document.querySelector("#print-page");

const COURSE_LABELS = { "8": "Grade 8", algebra1: "Algebra I" };
const TYPE_LABELS = { "multiple-choice": "Multiple choice", "constructed-response": "Constructed response", mixed: "Mixed format" };
const topicSets = {
  "8": [
    { id: "algebra", label: "Algebra of one variable" }, { id: "geometry", label: "Geometry tools" },
    { id: "transformations", label: "Transformations & similarity" }, { id: "lines", label: "Equations of lines" },
    { id: "functions", label: "Functions" }, { id: "exponents", label: "Exponents & roots" },
    { id: "pythagorean", label: "Pythagorean theorem" }, { id: "measurement", label: "Volume & surface area" },
    { id: "scientific", label: "Scientific notation" }, { id: "systems", label: "Systems of equations" },
    { id: "statistics", label: "Statistics of two variables" }
  ],
  algebra1: [
    { id: "building", label: "Building blocks of algebra" }, { id: "linear", label: "Linear expressions & equations" },
    { id: "functions", label: "Functions" }, { id: "linear-models", label: "Linear functions & sequences" },
    { id: "systems", label: "Systems of equations" }, { id: "exponents", label: "Exponents" },
    { id: "polynomials", label: "Polynomials" }, { id: "quadratics", label: "Quadratic functions" },
    { id: "roots", label: "Roots & irrational numbers" }, { id: "statistics", label: "Statistics" },
    { id: "modeling", label: "Functions & modeling" }
  ]
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choose = items => items[rand(0, items.length - 1)];
const nonZero = (min, max) => { let value = 0; while (value === 0) value = rand(min, max); return value; };
const signed = value => value < 0 ? "− " + Math.abs(value) : "+ " + value;
const term = (coefficient, variable = "x") => coefficient === 1 ? variable : coefficient === -1 ? "−" + variable : coefficient + variable;
const shuffle = items => [...items].sort(() => Math.random() - 0.5);

function question(data) {
  return { skill: data.skill, prompt: data.prompt, answer: String(data.answer), check: data.check, distractors: (data.distractors || []).map(String) };
}

function linearEquation() {
  const a = nonZero(-8, 8), x = rand(-7, 9), b = rand(-12, 12), c = a * x + b;
  return question({ skill: "Solve a linear equation", prompt: "Solve for x: " + term(a) + " " + signed(b) + " = " + c, answer: "x = " + x, check: "Substitute " + x + " for x: " + a * x + " " + signed(b) + " = " + c + ".", distractors: ["x = " + -x, "x = " + c, "x = " + (x + 1)] });
}

function twoStepEquation() {
  const a = rand(2, 6), x = rand(1, 9), b = rand(-9, 10), c = a * (x + b);
  return question({ skill: "Solve a two-step equation", prompt: "Solve for x: " + a + "(x " + signed(b) + ") = " + c, answer: "x = " + x, check: "Divide by " + a + ", then isolate x.", distractors: ["x = " + (x - b), "x = " + (c - b), "x = " + (x + b)] });
}

function lineEquation() {
  const m = nonZero(-5, 5), x = rand(-4, 5), b = rand(-8, 8), y = m * x + b;
  return question({ skill: "Write a line from a point and slope", prompt: "A line has slope " + m + " and passes through (" + x + ", " + y + "). Which equation represents the line?", answer: "y = " + term(m) + " " + signed(b), check: "Use y = mx + b and substitute (" + x + ", " + y + ") to find b = " + b + ".", distractors: ["y = " + term(-m) + " " + signed(b), "y = " + term(m) + " " + signed(-b), "y = " + term(b) + " " + signed(m)] });
}

function evaluateFunction() {
  const a = nonZero(-4, 5), b = rand(-7, 8), x = rand(-3, 5), result = a * x + b;
  return question({ skill: "Evaluate a function", prompt: "If f(x) = " + term(a) + " " + signed(b) + ", what is f(" + x + ")?", answer: result, check: "f(" + x + ") = " + a + "(" + x + ") " + signed(b) + " = " + result + ".", distractors: [a * (x + 1) + b, a + x + b, result + a] });
}

function exponentRule() {
  const variable = choose(["x", "a", "m"]), a = rand(2, 6), b = rand(2, 5);
  return question({ skill: "Use exponent rules", prompt: "Simplify: " + variable + "^" + a + " · " + variable + "^" + b, answer: variable + "^" + (a + b), check: "When multiplying like bases, add exponents: " + a + " + " + b + " = " + (a + b) + ".", distractors: [variable + "^" + (a * b), variable + "^" + (a - b), variable + "^" + (a + b + 1)] });
}

function polynomialProduct() {
  const a = rand(2, 6), b = rand(2, 7), product = a * b;
  return question({ skill: "Multiply polynomials", prompt: "Expand: (x + " + a + ")(x + " + b + ")", answer: "x² + " + (a + b) + "x + " + product, check: "FOIL gives x² + " + (a + b) + "x + " + product + ".", distractors: ["x² + " + product + "x + " + (a + b), "x² + " + (a + b) + "x − " + product, "x² + " + (a + b + 1) + "x + " + product] });
}

function quadraticRoots() {
  const rootA = rand(-6, 5), rootB = nonZero(-6, 7), sum = rootA + rootB, product = rootA * rootB;
  return question({ skill: "Find quadratic roots", prompt: "Solve: x² " + signed(-sum) + "x " + signed(product) + " = 0", answer: "x = " + rootA + " or x = " + rootB, check: "The equation factors as (x " + signed(-rootA) + ")(x " + signed(-rootB) + ") = 0.", distractors: ["x = " + -rootA + " or x = " + -rootB, "x = " + sum + " or x = " + product, "x = " + rootA + " or x = " + -rootB] });
}

function systemEquation() {
  const x = rand(-4, 6), y = rand(-3, 7), a = nonZero(1, 5), b = nonZero(1, 5), c = nonZero(1, 5), d = nonZero(1, 5);
  if (a * d === b * c) return systemEquation();
  return question({ skill: "Solve a system", prompt: "Solve the system: " + a + "x + " + b + "y = " + (a * x + b * y) + " and " + c + "x + " + d + "y = " + (c * x + d * y), answer: "(" + x + ", " + y + ")", check: "The ordered pair (" + x + ", " + y + ") makes both equations true.", distractors: ["(" + y + ", " + x + ")", "(" + -x + ", " + y + ")", "(" + (x + 1) + ", " + y + ")"] });
}

function scientificNotation() {
  const coefficient = choose([2.4, 3.7, 5.1, 6.8, 9.2]), exponent = rand(3, 7);
  return question({ skill: "Use scientific notation", prompt: "Write " + coefficient * 10 ** exponent + " in scientific notation.", answer: coefficient + " × 10^" + exponent, check: "Move the decimal so one nonzero digit remains to the left.", distractors: [coefficient + " × 10^" + (exponent - 1), coefficient * 10 + " × 10^" + exponent, coefficient + " × 10^" + (exponent + 1)] });
}

function pythagorean() {
  const legs = choose([[6, 8], [5, 12], [9, 12]]), hyp = Math.sqrt(legs[0] ** 2 + legs[1] ** 2);
  return question({ skill: "Apply the Pythagorean theorem", prompt: "A right triangle has legs of " + legs[0] + " cm and " + legs[1] + " cm. What is the length of its hypotenuse?", answer: hyp + " cm", check: "a² + b² = c², so " + legs[0] + "² + " + legs[1] + "² = " + hyp + "².", distractors: [(legs[0] + legs[1]) + " cm", Math.abs(legs[1] - legs[0]) + " cm", (hyp + 2) + " cm"] });
}

function volume() {
  const length = rand(3, 8), width = rand(2, 6), height = rand(2, 5), result = length * width * height;
  return question({ skill: "Find volume", prompt: "Find the volume of a rectangular prism with length " + length + " units, width " + width + " units, and height " + height + " units.", answer: result + " cubic units", check: "V = lwh = " + length + " · " + width + " · " + height + " = " + result + ".", distractors: [(length + width + height) + " cubic units", length * width + " cubic units", (result + height) + " cubic units"] });
}

function statistics() {
  const start = rand(2, 8), values = [start, start + 2, start + 4, start + 6], total = values.reduce((sum, value) => sum + value, 0), mean = total / values.length;
  return question({ skill: "Interpret a data set", prompt: "What is the mean of the data set " + values.join(", ") + "?", answer: mean, check: "The values total " + total + "; divide by 4.", distractors: [values[1], values[2], mean + 1] });
}

function transformation() {
  const shift = rand(2, 6), direction = choose(["up", "down", "right", "left"]);
  const expression = direction === "up" ? "f(x) + " + shift : direction === "down" ? "f(x) − " + shift : direction === "right" ? "f(x − " + shift + ")" : "f(x + " + shift + ")";
  const opposite = direction === "up" ? "down" : direction === "down" ? "up" : direction === "right" ? "left" : "right";
  return question({ skill: "Describe a transformation", prompt: "What transformation maps f(x) to g(x) = " + expression + "?", answer: "Translate " + direction + " " + shift + " units.", check: "Outside the function changes vertical position; inside the function changes horizontal position.", distractors: ["Translate " + opposite + " " + shift + " units.", "Reflect across the x-axis.", "Stretch vertically by " + shift + "."] });
}

function simplifyRadical() {
  const outside = choose([2, 3, 4]), inside = outside === 2 ? 3 : outside === 3 ? 5 : 2, radicand = outside ** 2 * inside;
  return question({ skill: "Simplify a radical", prompt: "Simplify √" + radicand + ".", answer: outside + "√" + inside, check: "Factor out the perfect square " + outside ** 2 + ".", distractors: [inside + "√" + outside, (outside + 1) + "√" + inside, "√" + outside * inside] });
}

function sequence() {
  const first = rand(-5, 6), difference = rand(2, 7), termNumber = rand(5, 9), result = first + (termNumber - 1) * difference;
  return question({ skill: "Use an arithmetic sequence", prompt: "An arithmetic sequence starts with " + first + " and has a common difference of " + difference + ". What is the " + termNumber + "th term?", answer: result, check: "aₙ = " + first + " + (n − 1)(" + difference + ") = " + result + ".", distractors: [first + termNumber * difference, result - difference, first + difference] });
}

function exponentialModel() {
  const start = choose([80, 120, 150]), growth = choose([10, 20, 25]), years = rand(2, 4), rounded = Math.round(start * (1 + growth / 100) ** years * 100) / 100;
  return question({ skill: "Interpret an exponential model", prompt: "A quantity starts at " + start + " and grows by " + growth + "% each year. What is its value after " + years + " years? Round to the nearest hundredth.", answer: rounded, check: "Use " + start + "(1." + String(growth).padStart(2, "0") + ")^" + years + ".", distractors: [start + growth * years, Math.round(start * (1 + growth / 100) ** (years - 1) * 100) / 100, rounded + 10] });
}

const generators = {
  "8": { algebra: [linearEquation, twoStepEquation], geometry: [pythagorean], transformations: [transformation], lines: [lineEquation], functions: [evaluateFunction], exponents: [exponentRule, simplifyRadical], pythagorean: [pythagorean], measurement: [volume], scientific: [scientificNotation], systems: [systemEquation], statistics: [statistics] },
  algebra1: { building: [evaluateFunction], linear: [linearEquation, twoStepEquation], functions: [evaluateFunction], "linear-models": [lineEquation, sequence], systems: [systemEquation], exponents: [exponentRule], polynomials: [polynomialProduct], quadratics: [quadraticRoots], roots: [simplifyRadical], statistics: [statistics], modeling: [exponentialModel, lineEquation] }
};

function updateTopicOptions() {
  const grade = gradeEl.value, current = topicEl.value;
  topicEl.innerHTML = ['<option value="all">All ' + COURSE_LABELS[grade] + ' topics</option>'].concat(topicSets[grade].map(topic => '<option value="' + topic.id + '">' + topic.label + "</option>")).join("");
  if (["all"].concat(topicSets[grade].map(topic => topic.id)).includes(current)) topicEl.value = current;
}

function topicLabel(grade, id) {
  if (id === "all") return "Mixed topics";
  return (topicSets[grade].find(topic => topic.id === id) || {}).label || "Mixed topics";
}

function getGeneratorPool(grade, topic) {
  if (topic !== "all") return generators[grade][topic] || generators[grade][topicSets[grade][0].id];
  return Object.values(generators[grade]).flat();
}

function chooseType(type, index) {
  return type === "mixed" ? (index % 2 === 0 ? "multiple-choice" : "constructed-response") : type;
}

function createProblems(grade, topic, count, type) {
  const pool = getGeneratorPool(grade, topic);
  return Array.from({ length: count }, (_, index) => Object.assign({}, choose(pool)(), { type: chooseType(type, index) }));
}

function escapeHtml(value) {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" };
  return String(value).replace(/[&<>"']/g, char => replacements[char]);
}

function renderProblem(problem, index) {
  const allChoices = [problem.answer].concat(problem.distractors).filter((value, index, array) => array.indexOf(value) === index);
  const choices = problem.type === "multiple-choice" ? shuffle(allChoices).slice(0, 4) : [];
  const fallbacks = ["Cannot be determined", "Not enough information", "None of these"];
  let fallbackIndex = 0;
  while (problem.type === "multiple-choice" && choices.length < 4) choices.push(fallbacks[fallbackIndex++]);
  const choiceMarkup = choices.length ? '<ul class="choices">' + choices.map((choice, choiceIndex) => '<li class="choice"><span class="choice-letter">' + String.fromCharCode(65 + choiceIndex) + '.</span><span>' + escapeHtml(choice) + "</span></li>").join("") + "</ul>" : '<div class="response-lines" aria-label="Response space"><span class="response-line"></span><span class="response-line"></span><span class="response-line"></span></div>';
  return '<article class="problem-card"><div class="problem-top"><span class="problem-number">' + String(index + 1).padStart(2, "0") + '</span><span class="problem-type">' + (problem.type === "multiple-choice" ? "Multiple choice" : "Constructed response") + '</span></div><p class="problem-skill">' + escapeHtml(problem.skill) + '</p><p class="question">' + escapeHtml(problem.prompt) + "</p>" + choiceMarkup + '<p class="answer-reveal"><strong>Answer:</strong> ' + escapeHtml(problem.answer) + "</p></article>";
}

function renderAnswerKey(problems) {
  answerKeyEl.innerHTML = problems.map((problem, index) => '<li><div><strong>' + (index + 1) + ". " + escapeHtml(problem.answer) + '</strong><span class="quick-check">' + escapeHtml(problem.check) + "</span></div></li>").join("");
}

function hideAnswers() {
  document.body.classList.remove("answers-visible");
  answerKeyPanel.hidden = true;
  toggleAnswersButton.textContent = "Show answers";
  toggleAnswersButton.setAttribute("aria-pressed", "false");
}

function showAnswers() {
  document.body.classList.add("answers-visible");
  answerKeyPanel.hidden = false;
  toggleAnswersButton.textContent = "Hide answers";
  toggleAnswersButton.setAttribute("aria-pressed", "true");
}

function generateProblems(event) {
  if (event) event.preventDefault();
  const grade = gradeEl.value, topic = topicEl.value || "all", count = Math.min(20, Math.max(1, Number(countEl.value) || 8)), type = typeEl.value;
  countEl.value = count;
  const problems = createProblems(grade, topic, count, type);
  titleEl.textContent = COURSE_LABELS[grade] + " · " + (topic === "all" ? "mixed review" : topicLabel(grade, topic));
  problemSummaryEl.textContent = count + " question" + (count === 1 ? "" : "s");
  sourceSummaryEl.textContent = topicLabel(grade, topic);
  typeSummaryEl.textContent = TYPE_LABELS[type];
  problemsEl.innerHTML = problems.map(renderProblem).join("");
  renderAnswerKey(problems);
  hideAnswers();
  problemsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

gradeEl.addEventListener("change", updateTopicOptions);
form.addEventListener("submit", generateProblems);
toggleAnswersButton.addEventListener("click", () => document.body.classList.contains("answers-visible") ? hideAnswers() : showAnswers());
hideAnswersButton.addEventListener("click", hideAnswers);
printButton.addEventListener("click", () => window.print());
updateTopicOptions();
generateProblems();
