import { login, signup } from "./auth.js";
import { initStats } from "./stats.js";

const authTitle = document.getElementById("authTitle");
const loginCard = document.getElementById("loginCard");
const signupCard = document.getElementById("signupCard");

const loginForm = document.getElementById("loginForm");
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginBackButton = document.getElementById("loginBackButton");
const switchToSignupButton = document.getElementById("switchToSignupButton");

const signupForm = document.getElementById("signupForm");
const signupUsernameInput = document.getElementById("signupUsername");
const signupPasswordInput = document.getElementById("signupPassword");
const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
const signupError = document.getElementById("signupError");
const signupBackButton = document.getElementById("signupBackButton");
const switchToLoginButton = document.getElementById("switchToLoginButton");

function showLogin() {
  authTitle.textContent = "LOGIN";
  loginError.textContent = "";
  loginError.classList.add("hidden");
  loginForm.reset();
  signupCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  loginUsernameInput.focus();
}

function showSignup() {
  authTitle.textContent = "SIGN UP";
  signupError.textContent = "";
  signupError.classList.add("hidden");
  signupForm.reset();
  loginCard.classList.add("hidden");
  signupCard.classList.remove("hidden");
  signupUsernameInput.focus();
}

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "signup" || window.location.hash === "#signup") {
  showSignup();
} else {
  showLogin();
}

if (switchToSignupButton) {
  switchToSignupButton.addEventListener("click", () => {
    showSignup();
  });
}

if (switchToLoginButton) {
  switchToLoginButton.addEventListener("click", () => {
    showLogin();
  });
}

if (loginBackButton) {
  loginBackButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

if (signupBackButton) {
  signupBackButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    loginError.classList.add("hidden");

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value;

    try {
      await login(username, password);
      await initStats();
      window.location.href = "index.html";
    } catch (err) {
      loginError.textContent = err.message || "Failed to log in.";
      loginError.classList.remove("hidden");
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupError.textContent = "";
    signupError.classList.add("hidden");

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;

    if (password !== confirmPassword) {
      signupError.textContent = "Passwords do not match.";
      signupError.classList.remove("hidden");
      return;
    }

    try {
      await signup(username, password);
      await initStats();
      window.location.href = "index.html";
    } catch (err) {
      signupError.textContent = err.message || "Failed to sign up.";
      signupError.classList.remove("hidden");
    }
  });
}
