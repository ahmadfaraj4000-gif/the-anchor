(function () {
  const resourceGrid = document.querySelector("#resourceGrid");
  if (!resourceGrid) return;

  function contactLine(resource) {
    return [
      resource.contactName ? `<span>${resource.contactName}</span>` : "",
      resource.contactEmail ? `<a href="mailto:${resource.contactEmail}">${resource.contactEmail}</a>` : "",
      resource.contactPhone ? `<a href="tel:${resource.contactPhone}">${resource.contactPhone}</a>` : "",
      resource.website ? `<a href="${resource.website}" target="_blank" rel="noreferrer">Website</a>` : "",
      resource.address ? `<span>${resource.address}</span>` : ""
    ].filter(Boolean).join("");
  }

  function render(resources) {
    if (!resources.length) return;
    resourceGrid.innerHTML = resources.map((resource) => `
      <article class="card resourceCard">
        <div class="icon">${resource.name.charAt(0).toUpperCase()}</div>
        <h3>${resource.name}</h3>
        <div class="resourceMeta">
          <span>${resource.organizationType}</span>
          <span>${resource.specialty}</span>
        </div>
        <p>${resource.description}</p>
        <div class="resourceContact">${contactLine(resource)}</div>
      </article>
    `).join("");
  }

  async function init() {
    try {
      const { resources } = await window.AnchorApi.get("/api/public");
      render(resources || []);
    } catch (error) {
      resourceGrid.innerHTML = `<p class="notice">${error.message}</p>`;
    }
  }

  init();
})();
