import {
  action, html, repeat, router, view,
} from 'jetstart';

// An Action that increments the count by the supplied `delta`
const increment = action(({ commit, state }, delta) => {
  state.count = (state.count || 0) + delta;
  commit(state);
});

// An event-handler
const handleIncrement = (e) => {
  e.preventDefault();
  const input = e.target.elements.increment;
  increment(Number(input.value || 0));
};

// A View that demonstrates conditional and iterated rendering
const countView = view(({ render, state }) => {
  const count = state.count || 0;
  const items = count > 0 ? [...Array(count).keys()] : [];
  const listItems = repeat(items, i => html`<li>${i + 1}</li>`);
  render`<p>${count} (${count % 2 === 0 ? 'even' : html`<b>odd</b>`})</p><ul>${listItems}</ul>`;
});

// A View that demonstrates HTML form handling
const formView = view(
  ({ render }, initialCount) => render`
    <label>increment by<input name="increment" type="number" value="${initialCount}"/><input type="submit"></label>`,
);

// A View that demonstrates accepting a string as an argument: `title`
const headerView = view(
  ({ render }, title, slot = '') => render`
  <h1>${title}</h1><nav><a href="/">one</a> | <a href="/two">two</a></nav>${slot}`,
);

/**
 *  A View that demonstrates:
 * - binding an event handler
 * - embedding a View and passing it an argument: `formView(2)`
 */
const countOneView = view(
  ({ render }) => render`
  ${headerView('Count One')} ${countView()} <form @submit="${handleIncrement}">${formView(2)}</form>`,
);

// A View that demonstrates passing a View as an argument to an embedded View.
const countTwoView = view(({ render }) => render`${headerView('Count Two', countView())}`);

const thenNext = (fn, ...args) => (_, next) => {
  fn(...args);
  next();
};
const addOne = () => increment(1);
const addOneThenNext = thenNext(addOne);

// Configure URL routing
router(document.body, ['/', addOneThenNext, countOneView], ['/two', addOneThenNext, countTwoView, addOne]).start();
