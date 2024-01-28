import {
  mergeMap,
  fromEvent,
  startWith,
  map,
  mergeWith,
  shareReplay,
  tap,
} from "rxjs";

const e_refreshButton = document.querySelector(".refresh");
const refreshClick$ = fromEvent(e_refreshButton, "click");

const request$ = refreshClick$.pipe(
  // we use startWith to also trigger on page load;
  // no need to imitate a real event object, we just need some value (it will be remapped later in map operator anyway)
  startWith(null),
  // now we need to map each click to some url
  map(() => `https://api.github.com/users?since=${getRandomOffset()}`)
);

const response$ = request$.pipe(
  mergeMap((url) => fetch(url)),
  mergeMap((response) => response.json()),
  tap(console.log)
  // shareReplay(1),
);

/* 3
To implement independent renewal of suggestions, we need to: 
*/

// find button elements
const e_closeButton1 = document.querySelector(".close1");
const e_closeButton2 = document.querySelector(".close2");
const e_closeButton3 = document.querySelector(".close3");

// create individual click stream for each one
const close1Click$ = fromEvent(e_closeButton1, "click");
const close2Click$ = fromEvent(e_closeButton2, "click");
const close3Click$ = fromEvent(e_closeButton3, "click");

// each click stream must yield individual suggestion stream
const suggestion1$ = createSuggestionStream(close1Click$);
const suggestion2$ = createSuggestionStream(close2Click$);
const suggestion3$ = createSuggestionStream(close3Click$);

// we can use a common function for this
function createSuggestionStream(closeClick$) {
  return closeClick$.pipe(
    startWith(null),
    mergeMap((_) => response$),
    map((usersList) => getRandomUser(usersList)),
    mergeWith(refreshClick$.pipe(map(() => null)))
    /* 
		we need 'mergeWith' refreshClick$ to immediately clear the list when 'refresh' button is pressed
		instead of waiting until request will be executed
		the difference is noticeable if we enable network throttling

		we also add corresponding check to renderSuggestion function to hide it
		if (suggestedUser === null) 
		*/
  );
}

suggestion1$.subscribe((suggestedUser) =>
  renderSuggestion(suggestedUser, ".suggestion1")
);

suggestion2$.subscribe((suggestedUser) =>
  renderSuggestion(suggestedUser, ".suggestion2")
);

suggestion3$.subscribe((suggestedUser) =>
  renderSuggestion(suggestedUser, ".suggestion3")
);

// UTILITY FUNCTIONS

function getRandomUser(usersList) {
  return usersList[Math.floor(Math.random() * usersList.length)];
}

function getRandomOffset() {
  return Math.floor(Math.random() * 500);
}

function renderSuggestion(suggestedUser, selector) {
  const suggestion_el = document.querySelector(selector);

  if (suggestedUser === null) {
    suggestion_el.style.visibility = "hidden";
  } else {
    suggestion_el.style.visibility = "visible";

    const username_el = suggestion_el.querySelector(".username");
    username_el.href = suggestedUser.html_url;
    username_el.textContent = suggestedUser.login;

    const img_el = suggestion_el.querySelector("img");
    img_el.src = suggestedUser.avatar_url;
  }
}
