function submitVote() {

  const rollInput = document.getElementById("roll");
  const errorBox = document.getElementById("rollError");
  const statusBox = document.getElementById("status");
  const btn = document.querySelector("button");

  let roll = rollInput.value.trim().toUpperCase();

  // 🔄 Reset UI
  errorBox.innerText = "";
  rollInput.classList.remove("input-error");

  // 🔒 DEVICE LOCK CHECK (FIRST THING)
  if (localStorage.getItem("hasVoted") === "true") {
    errorBox.innerText = "❌ This device has already voted!";
    return;
  }

  // ✅ STRICT ROLL VALIDATION
  let pattern = /^(25104|25108)[AB]\d{4}$/;

  if (!pattern.test(roll)) {
    errorBox.innerText = "⚠️ Enter valid Roll No (e.g., 25104A0075)";
    rollInput.classList.add("input-error");
    return;
  }

  // 🎯 Party selection check
  let selected = document.querySelector('input[name="vote"]:checked');
  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🔒 GENERATE / GET DEVICE ID
  let deviceID = localStorage.getItem("deviceID");
  if (!deviceID) {
    deviceID = "DEV-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceID", deviceID);
  }

  // 🔐 LOCK DEVICE IMMEDIATELY (IMPORTANT FIX)
  localStorage.setItem("hasVoted", "true");

  // 🔘 Disable button (prevent spam)
  btn.disabled = true;
  btn.innerText = "Submitting...";
  statusBox.innerText = "Submitting your vote...";

  // 🌐 SEND DATA TO BACKEND
  fetch("https://script.google.com/macros/s/AKfycbwamveEfyD_auKgOYEflWQCU0bijBePHOOmCAM7Utt1KR0aAqoq5eYtctzt3vm7tLMh/exec", {
    method: "POST",
    body: JSON.stringify({
      roll: roll,
      vote: selected.value,
      deviceID: deviceID
    })
  })
  .then(res => res.text())
  .then(data => {

    // ❌ Duplicate roll (backend)
    if (data.includes("Already voted")) {
      errorBox.innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";

      // 🔓 Unlock device (since vote failed)
      localStorage.removeItem("hasVoted");
      return;
    }

    // ❌ Same device (backend)
    if (data.includes("Device used")) {
      errorBox.innerText = "❌ This device has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    // ✅ SUCCESS
    statusBox.innerText = "✅ Vote submitted successfully!";
    btn.innerText = "Vote Submitted";
  })
  .catch(() => {
    statusBox.innerText = "❌ Error submitting vote!";
    btn.disabled = false;
    btn.innerText = "Submit Vote";

    // 🔓 Unlock if error happens
    localStorage.removeItem("hasVoted");
  });
}
