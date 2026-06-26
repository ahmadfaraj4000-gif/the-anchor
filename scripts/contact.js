(function () {
  document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Message received in demo mode.");
    event.currentTarget.reset();
  });
})();
