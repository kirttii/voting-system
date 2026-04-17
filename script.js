function submitVote() {

  let rollInput = document.getElementById("roll");
  let errorBox = document.getElementById("rollError");

  let roll = rollInput.value.trim().toUpperCase();

  // Clear previous error
  errorBox.innerText = "";
  rollInput.classList.remove("input-error");

  // ✅ STRICT COLLEGE VALIDATION
  let pattern = /^(25104|25108)[AB]\d{4}$/;

  if (!pattern.test(roll)) {
    errorBox.innerText = "⚠️ Enter valid Roll No (e.g., 25104A0075)";
    rollInput.classList.add("input-error");

    setTimeout(() => {
      rollInput.classList.remove("input-error");
    }, 300);

    return;
  }

  // 🎯 Check party selection
  let selected = document.querySelector('input[name="vote"]:checked');

  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🔒 Prevent duplicate voting (roll-based)
  let votedRolls = JSON.parse(localStorage.getItem("votedRolls")) || [];

  if (votedRolls.includes(roll)) {
    errorBox.innerText = "❌ This Roll Number has already voted!";
    rollInput.classList.add("input-error");

    setTimeout(() => {
      rollInput.classList.remove("input-error");
    }, 300);

    return;
  }

  // 🔘 Button loading state
  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  document.getElementById("status").innerText = "Submitting your vote...";

  // 🌐 Send to backend
  fetch("https://script.google.com/macros/s/AKfycbzYc__OoWiNM1i1levJOGEVOKGgvwB-ke3ptKOMfS702O7SK_r_uY9z9xHxBccxHAhI/exec", {
    method: "POST",
    body: JSON.stringify({
      vote: selected.value,
      roll: roll
    })
  })
  .then(res => res.text())
  .then(data => {

    // ❌ Backend duplicate
    if (data === "Already voted") {
      errorBox.innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    // ✅ SUCCESS
    document.getElementById("status").innerText = "✅ Vote submitted successfully!";

    votedRolls.push(roll);
    localStorage.setItem("votedRolls", JSON.stringify(votedRolls));

    btn.innerText = "Vote Submitted";
  })
  .catch(() => {
    document.getElementById("status").innerText = "❌ Error submitting vote!";
    btn.disabled = false;
    btn.innerText = "Submit Vote";
  });
}
