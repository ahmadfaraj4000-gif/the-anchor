(function () {
  const siteUrl = (
    window.ANCHOR_CONVEX_SITE_URL ||
    document.querySelector('meta[name="convex-site-url"]')?.content ||
    ""
  ).replace(/\/$/, "");

  function apiUrl(path) {
    if (!siteUrl) {
      throw new Error("The site connection is not configured yet.");
    }
    return `${siteUrl}${path}`;
  }

  async function get(path) {
    const response = await fetch(apiUrl(path));
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return await response.json();
  }

  async function post(path, payload) {
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
    return data;
  }

  window.AnchorApi = { get, post };
})();
