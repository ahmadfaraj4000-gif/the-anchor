(function () {
  function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  }

  function saveAccount(user) {
    if (!user?.email) return;
    setCookie("anchorUserEmail", user.email);
    setCookie("anchorUserName", user.name || "Member");
  }

  function accountEmail() {
    const value = getCookie("anchorUserEmail");
    return value ? decodeURIComponent(value) : "";
  }

  function requireAccount() {
    location.href = "login.html";
    return "";
  }

  window.AnchorAuth = { saveAccount, accountEmail, requireAccount };
})();
