(function () {
  const podcastGrid = document.querySelector("#podcastGrid");
  if (!podcastGrid) return;

  function embedList(podcast) {
    const embeds = [
      ["YouTube", podcast.youtubeEmbedUrl || (podcast.platform === "YouTube" ? podcast.embedUrl : "")],
      ["Spotify", podcast.spotifyEmbedUrl || (podcast.platform === "Spotify" ? podcast.embedUrl : "")],
      ["Apple Music", podcast.appleMusicEmbedUrl || (podcast.platform === "Apple Music" ? podcast.embedUrl : "")]
    ].filter(([, url]) => url);

    return embeds.map(([label, url]) => `
      <div class="embedBlock">
        <p class="eyebrow">${label}</p>
        <iframe src="${url}" title="${podcast.title} on ${label}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
    `).join("");
  }

  function linkList(podcast) {
    const links = [
      ["YouTube", podcast.youtubeEmbedUrl || (podcast.platform === "YouTube" ? podcast.embedUrl : "")],
      ["Spotify", podcast.spotifyEmbedUrl || (podcast.platform === "Spotify" ? podcast.embedUrl : "")],
      ["Apple Music", podcast.appleMusicEmbedUrl || (podcast.platform === "Apple Music" ? podcast.embedUrl : "")]
    ].filter(([, url]) => url);

    if (!links.length) return `<p class="notice">Listening links are coming soon.</p>`;

    return `<div class="podcastLinks">${links.map(([label, url]) => `<a class="btn green" href="${url}" target="_blank" rel="noreferrer">${label}</a>`).join("")}</div>`;
  }

  function render(podcasts) {
    podcastGrid.innerHTML = podcasts.map((podcast) => `
      <article class="podcastCard">
        <div class="podcastTop">
          <img class="podcastImage" src="${podcast.imageUrl || "assets/logos/logo.png"}" alt="${podcast.title}">
          <div class="podcastMain">
            <h3>${podcast.title}</h3>
            <p class="podcastDescription">${podcast.description}</p>
            ${linkList(podcast)}
            <div class="podcastEmbeds">${embedList(podcast)}</div>
          </div>
        </div>
      </article>
    `).join("");

    if (!podcasts.length) podcastGrid.innerHTML = `<p class="notice">No podcast episodes are available right now. Check back soon.</p>`;
  }

  async function init() {
    try {
      const { podcasts } = await window.AnchorApi.get("/api/public");
      render(podcasts);
    } catch (error) {
      podcastGrid.innerHTML = `<p class="notice">${error.message}</p>`;
    }
  }

  init();
})();
