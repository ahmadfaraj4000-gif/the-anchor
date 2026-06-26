(function () {
  const causeGrid = document.querySelector("#causeGrid");
  if (!causeGrid) return;
  let causes = [];

  function render() {
    causeGrid.innerHTML = causes.map((cause) => `
      <article class="card">
        <div class="icon">$</div>
        <h3>${cause.title}</h3>
        <p>${cause.description}</p>
        <p><b>Goal:</b> $${Math.round(cause.goalCents / 100).toLocaleString()}</p>
        <button class="btn green" data-donate="${cause._id}">Donate Now</button>
      </article>
    `).join("");

    if (!causes.length) causeGrid.innerHTML = `<p class="notice">No donation causes are available right now.</p>`;

    document.querySelectorAll("[data-donate]").forEach((button) => {
      button.addEventListener("click", async () => {
        const email = window.AnchorAuth.requireAccount();
        if (!email) return;
        const cause = causes.find((item) => item._id === button.dataset.donate);
        const amount = prompt("Donation amount");
        if (!amount) return;
        await window.AnchorApi.post("/api/donate", {
          causeId: button.dataset.donate,
          email,
          amountCents: Math.round(Number(amount) * 100),
          campaign: cause?.title
        });
        if (cause?.paymentUrl) location.href = cause.paymentUrl;
        else alert("Donation pledge saved. A payment link will be available soon.");
      });
    });
  }

  async function init() {
    try {
      const data = await window.AnchorApi.get("/api/public");
      causes = data.causes;
      render();
    } catch (error) {
      causeGrid.innerHTML = `<p class="notice">${error.message}</p>`;
    }
  }

  init();
})();
