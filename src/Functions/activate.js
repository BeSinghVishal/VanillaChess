export const Highlighter = (element) => {
  element.classList.add("highlight_from");
  setTimeout(() => {
    element.classList.remove("highlight_from");
  }, 800);
};
