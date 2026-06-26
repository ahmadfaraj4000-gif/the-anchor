(function () {
  function showSignupMode() {
    document.body.dataset.authMode = "signup";
  }

  function showLoginMode() {
    document.body.dataset.authMode = "login";
  }

  async function loginUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const { user } = await window.AnchorApi.post("/api/login", { email: form.email.value.trim() });
      window.AnchorAuth.saveAccount(user);
      location.href = "client/";
    } catch {
      showSignupMode();
      document.querySelector("#signupEmail").value = form.email.value.trim();
      document.querySelector(".authMessage").textContent = "We did not find that email yet. Create your account below.";
    }
  }

  async function registerUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const { user } = await window.AnchorApi.post("/api/signup", {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      dateOfBirth: form.dateOfBirth.value,
      neighborhood: form.neighborhood.value.trim(),
      familyRole: form.familyRole.value,
      interests: form.interests.value,
      preferredContact: form.preferredContact.value,
      supportNeeds: form.supportNeeds.value.trim()
    });
    window.AnchorAuth.saveAccount(user);
    location.href = "client/";
  }

  document.body.dataset.authMode = "login";
  document.querySelector("#showSignup")?.addEventListener("click", showSignupMode);
  document.querySelector("#showLogin")?.addEventListener("click", showLoginMode);
  document.querySelector(".authLogin")?.addEventListener("submit", loginUser);
  document.querySelector(".authSignup")?.addEventListener("submit", registerUser);
})();
