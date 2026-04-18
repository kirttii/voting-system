function submitVote() {

  let rollInput = document.getElementById("roll");
  let errorBox = document.getElementById("rollError");
  let statusBox = document.getElementById("status");

  let roll = rollInput.value.trim().toUpperCase();

  // Safety check
  if (!errorBox) {
    console.error("rollError element missing in HTML");
    return;
  }

  // Clear previous error
  errorBox.innerText = "";
  rollInput.classList.remove("input-error");

  // ✅ Roll validation
  let pattern = /^(25104|25108)[AB]\d{4}$/;

  if (!pattern.test(roll)) {
    errorBox.innerText = "⚠️ Enter valid Roll No (e.g., 25104A0075)";
    rollInput.classList.add("input-error");

    setTimeout(() => {
      rollInput.classList.remove("input-error");
    }, 300);

    return;
  }

  // 🎯 Party check
  let selected = document.querySelector('input[name="vote"]:checked');
  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🔘 Button state
  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Submitting...";
  statusBox.innerText = "Submitting your vote...";

  // 🌐 SEND
  fetch("https://script.google.com/macros/s/AKfycbzYc__OoWiNM1i1levJOGEVOKGgvwB-ke3ptKOMfS702O7SK_r_uY9z9xHxBccxHAhI/exec", {
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

    console.log("Response:", data);

    if (data === "Already voted") {
      errorBox.innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

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
