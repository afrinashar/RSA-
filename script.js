const sharedSecret = "mysecretkey";
const timeStep = 60; // seconds (RSA tokens usually use 60)
const validPassword = "admin123"; // Demo password

// Very simple hash-like function (demo only, not real crypto)
function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1000000;
  }
  return hash;
}

function generateToken() {
  const currentTime = Math.floor(Date.now() / 1000);
  const counter = Math.floor(currentTime / timeStep);
  const raw = sharedSecret + counter;
  return simpleHash(raw).toString().padStart(6, "0");
}

function updateToken() {
  const codeElement = document.getElementById("code");
  const timerElement = document.getElementById("timer");

  const currentTime = Math.floor(Date.now() / 1000);
  const secondsRemaining = timeStep - (currentTime % timeStep);

  const code = generateToken();
  codeElement.textContent = code;
  timerElement.textContent = `Next code in: ${secondsRemaining}s`;
}

// Two-factor authentication verification
function verifyToken() {
  const passwordInput = document.getElementById("passwordInput").value.trim();
  const tokenInput = document.getElementById("verifyInput").value.trim();
  const currentToken = generateToken();
  const resultElement = document.getElementById("verifyResult");

  // Check if both fields are filled
  if (!passwordInput || !tokenInput) {
    resultElement.textContent = "⚠️ Please enter both password and RSA token";
    resultElement.style.color = "orange";
    return;
  }

  // Verify both password and token
  const passwordValid = passwordInput === validPassword;
  const tokenValid = tokenInput === currentToken;

  if (passwordValid && tokenValid) {
    resultElement.textContent = "✅ Authentication Successful!";
    resultElement.style.color = "green";
    // Clear inputs on successful authentication
    document.getElementById("passwordInput").value = "";
    document.getElementById("verifyInput").value = "";
  } else if (!passwordValid && !tokenValid) {
    resultElement.textContent = "❌ Invalid password and RSA token";
    resultElement.style.color = "red";
  } else if (!passwordValid) {
    resultElement.textContent = "❌ Invalid password";
    resultElement.style.color = "red";
  } else {
    resultElement.textContent = "❌ Invalid RSA token";
    resultElement.style.color = "red";
  }
}

// Toggle password visibility and show valid password
function togglePassword() {
  const passwordInput = document.getElementById("passwordInput");
  const showPasswordBtn = document.getElementById("showPasswordBtn");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordInput.value = validPassword; // Show the valid password
    passwordInput.placeholder = `Valid password: ${validPassword}`;
    showPasswordBtn.textContent = "🙈";
    showPasswordBtn.title = "Hide password";
  } else {
    passwordInput.type = "password";
    passwordInput.value = "";
    passwordInput.placeholder = "Enter your password";
    showPasswordBtn.textContent = "👁️";
    showPasswordBtn.title = "Show password";
  }
}

// Refresh every second
setInterval(updateToken, 1000);
updateToken();
