const url =
  "https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*";

const getSuggestList = (keyword) =>
  fetch(url + "&search=" + keyword, { method: "GET", mode: "cors" }).then(
    (res) => res.json()
  );

const searchInput = document.getElementById("search");
const searchList = document.getElementById("suggest-list");

// 監聽
const keyword = Rx.Observable.fromEvent(searchInput, "input");
const selectItem = Rx.Observable.fromEvent(searchList, "click");

const render = (list = []) => {
  searchList.innerHTML = list.map((item) => `<li>${item}</li>`).join("");
};

keyword
  .debounceTime(100)
  .switchMap(
    (e) => getSuggestList(e.target.value),
    (e, res) => res[1]
  )
  .subscribe((list) => render(list));

selectItem
  .filter((e) => e.target.matches("li"))
  .map((e) => e.target.innerText)
  .subscribe((text) => {
    searchInput.value = text;
    render();
  });
