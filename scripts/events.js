(function () {
  const eventGrid = document.querySelector("#eventGrid");
  const filterBar = document.querySelector("#eventFilters");
  if (!eventGrid || !filterBar) return;

  function formatDate(event) {
    if (event.dateLabel && event.timeLabel) return `${event.dateLabel} • ${event.timeLabel}`;
    return new Date(event.startsAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function render(events) {
    const types = [...new Set(events.map((event) => event.category))];
    const activeType = new URLSearchParams(location.search).get("type") || "All";

    filterBar.innerHTML = ["All", ...types].map((type) => (
      `<button class="filter ${activeType === type ? "active" : ""}" data-filter="${type}">${type}</button>`
    )).join("");

    const visibleEvents = activeType === "All" ? events : events.filter((event) => event.category === activeType);
    eventGrid.innerHTML = types.map((type) => {
      const groupEvents = visibleEvents.filter((event) => event.category === type);
      if (!groupEvents.length) return "";
      return `
        <section class="eventGroup">
          <div class="groupHead">
            <p class="eyebrow">${type}</p>
            <h2>${type}</h2>
          </div>
          <div class="events">
            ${groupEvents.map((event) => `
              <article class="event">
                ${event.imageUrl ? `<img class="eventImage" src="${event.imageUrl}" alt="${event.title}">` : ""}
                <div class="date">${formatDate(event)}</div>
                <h3>${event.title}</h3>
                <div class="eventFacts">
                  <span>${event.location}</span>
                  <span>${event.rsvpCount || 0} RSVP${(event.rsvpCount || 0) === 1 ? "" : "s"}</span>
                </div>
                <p>${event.description}</p>
                <button class="btn green" data-rsvp="${event._id}">RSVP</button>
              </article>
            `).join("")}
          </div>
        </section>
      `;
    }).join("");

    if (!events.length) eventGrid.innerHTML = `<p class="notice">No events are available right now. Check back soon.</p>`;

    document.querySelectorAll(".filter").forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.filter;
        location.href = type === "All" ? "events.html" : `events.html?type=${encodeURIComponent(type)}`;
      });
    });

    document.querySelectorAll("[data-rsvp]").forEach((button) => {
      button.addEventListener("click", async () => {
        const email = window.AnchorAuth.requireAccount();
        if (!email) return;
        await window.AnchorApi.post("/api/rsvp", { eventId: button.dataset.rsvp, email });
        const rsvpedEvent = events.find((event) => event._id === button.dataset.rsvp);
        if (rsvpedEvent) rsvpedEvent.rsvpCount = (rsvpedEvent.rsvpCount || 0) + 1;
        render(events);
        alert("You're RSVP'd. We'll see you there.");
      });
    });
  }

  async function init() {
    try {
      const { events } = await window.AnchorApi.get("/api/public");
      render(events);
    } catch (error) {
      eventGrid.innerHTML = `<p class="notice">${error.message}</p>`;
    }
  }

  init();
})();
