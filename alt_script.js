let state = {
  stack: [0],
  symbols: "",
  input: "(a;a)$",
  action: "s3",
};

const productions = {
  1: "S:a",
  2: "S:(L)",
  3: "L:L;S",
  4: "L:S",
};

const table = {
  a: ["s2", "", "", "s2", "", "", "", "s2", ""],
  ";": ["", "", "r1", "", "s7", "r4", "r2", "", "r3"],
  "(": ["s3", "", "", "s3", "", "", "", "s3", ""],
  ")": ["", "", "r1", "", "s6", "r4", "r2", "", "r3"],
  $: ["", "OK", "r1", "", "", "", "r2", "", ""],
  S: ["1", "", "", "5", "", "", "", "8", ""],
  L: ["", "", "", "4", "", "", "", "s2", ""],
};

const printState = () => {
  Object.values(state).map((att, index) =>
    console.log(`${Object.keys(state)[index]}: ${att}`)
  );
  console.log();
};

const validate = () => {
  if (state.action === "") {
    throw "Syntax error: production doesn't exists";
  }
};

const getCurrentAction = (letter, index) => {
  if (table[letter] === undefined)
    throw `Lexical error: '${letter}' doesn't exists`;

  return table[letter][index];
};

const getNextAction = () => {
  let { stack, input, action } = state;

  let inputAsArray = input.split("");
  const currentChar = inputAsArray.shift();

  action = getCurrentAction(currentChar, stack[stack.length - 1]);

  return action;
};

const transition = (ls) => {
  let { stack } = state;

  const lastElement = stack[stack.length - 1];

  stack.push(getCurrentAction(ls, lastElement));

  state = { ...state, stack };
};

const shift = () => {
  let { stack, symbols, input, action } = state;

  let inputAsArray = input.split("");
  const currentChar = inputAsArray.shift();

  action = getCurrentAction(currentChar, stack[stack.length - 1]);
  stack.push(action[1]);
  symbols += currentChar;

  input = inputAsArray.join("");

  state = { stack, symbols, input, action };

  state = { ...state, action: getNextAction() };
};

const reduce = () => {
  let { stack, symbols, action } = state;

  const production = productions[action[1]];

  const [ls, rs] = production.split(":");

  const modifiedSymbol = symbols.replace(rs, ls);

  for (let i = 0; i < rs.length; i++) {
    stack.pop();
  }

  transition(ls);

  state = { ...state, stack, action: getNextAction(), symbols: modifiedSymbol };
};

function main() {
  printState();

  try {
    if (!state.input || state.input[state.input.length - 1] !== "$")
      throw "Invalid input error";

    while (state.action !== "OK") {
      state.action[0] === "s" ? shift() : reduce();
      printState();
      validate();
    }
  } catch (e) {
    console.error(e);
  }
}

main();
