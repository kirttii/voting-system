function submitVote() {

  const rollInput = document.getElementById("roll");
  const errorBox = document.getElementById("rollError");
  const statusBox = document.getElementById("status");
  const btn = document.querySelector("button");

  let roll = rollInput.value.trim().toUpperCase();

  // 🔄 Reset UI
  errorBox.innerText = "";
  rollInput.classList.remove("input-error");

  // ✅ ROLL VALIDATION
  let pattern = /^(25104|25108)[AB]\d{4}$/;
  if (!pattern.test(roll)) {
    errorBox.innerText = "⚠️ Enter valid Roll No (e.g., 25104A0075)";
    rollInput.classList.add("input-error");
    return;
  }

  // 🎯 PARTY CHECK
  let selected = document.querySelector('input[name="vote"]:checked');
  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🔘 UI LOCK
  btn.disabled = true;
  btn.innerText = "Submitting...";
  statusBox.innerText = "Submitting your vote...";

  // 🌐 SEND TO BACKEND
  fetch("https://script.google.com/macros/s/AKfycbwamveEfyD_auKgOYEflWQCU0bijBePHOOmCAM7Utt1KR0aAqoq5eYtctzt3vm7tLMh/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      roll: roll,
      vote: selected.value
    })
  })
  .then(res => res.text())
  .then(data => {

    if (data.includes("Already voted")) {
      errorBox.innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    if (data.includes("Error")) {
      statusBox.innerText = "❌ Server error!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    // ✅ SUCCESS
    statusBox.innerText = "✅ Vote submitted successfully!";
    btn.innerText = "Vote Submitted";

  })
  .catch((err) => {
    console.log(err);
    statusBox.innerText = "❌ Error submitting vote!";
    btn.disabled = false;
    btn.innerText = "Submit Vote";
  });
}
