function submitVote() {

  // 🔒 Device lock
  if (localStorage.getItem("voted")) {
    alert("❌ You have already voted from this device!");
    return;
  }

  // 🎯 Party selection
  let selected = document.querySelector('input[name="vote"]:checked');
  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🆔 Roll number
  let roll = document.getElementById("roll").value.trim().toUpperCase();
  if (!roll) {
    alert("Please enter your Roll Number!");
    return;
  }

  // 🔘 Button control
  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  document.getElementById("status").innerText = "Submitting your vote...";

  // 🌐 Backend call
  fetch("https://script.google.com/macros/s/AKfycbwamveEfyD_auKgOYEflWQCU0bijBePHOOmCAM7Utt1KR0aAqoq5eYtctzt3vm7tLMh/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vote: selected.value,
      roll: roll
    })
  })
  .then(res => res.text())
  .then(data => {

    if (data.includes("Already voted")) {
      document.getElementById("status").innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    // ✅ Success
    document.getElementById("status").innerText = "✅ Vote submitted successfully!";
    localStorage.setItem("voted", "true");
    btn.innerText = "Vote Submitted";

  })
  .catch(() => {
    document.getElementById("status").innerText = "❌ Error submitting vote!";
    btn.disabled = false;
    btn.innerText = "Submit Vote";
  });
}
