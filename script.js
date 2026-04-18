function submitVote() {

  // 🔒 Prevent multiple votes from same browser
  if (localStorage.getItem("voted")) {
    alert("You have already voted!");
    return;
  }

  // 🎯 Get selected party
  let selected = document.querySelector('input[name="vote"]:checked');

  if (!selected) {
    alert("Please select a party!");
    return;
  }

  // 🆔 Get roll number
  let roll = document.getElementById("roll").value.trim();

  if (!roll) {
    alert("Please enter your Roll Number!");
    return;
  }

  // 🔘 Button control
  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  document.getElementById("status").innerText = "Submitting your vote...";

  // 🌐 Send data to Google Apps Script
  fetch("https://script.google.com/macros/s/AKfycbzYc__OoWiNM1i1levJOGEVOKGgvwB-ke3ptKOMfS702O7SK_r_uY9z9xHxBccxHAhI/exec", {
    method: "POST",
    body: JSON.stringify({
      vote: selected.value,
      roll: roll
    })
  })
  .then(response => response.text())
  .then(data => {

    // ✅ If already voted (from backend)
    if (data === "Already voted") {
      document.getElementById("status").innerText = "❌ This Roll Number has already voted!";
      btn.disabled = false;
      btn.innerText = "Submit Vote";
      return;
    }

    // ✅ Success
    document.getElementById("status").innerText = "✅ Vote submitted successfully!";
    
    // Save in browser
    localStorage.setItem("voted", "true");

    btn.innerText = "Vote Submitted";

  })
  .catch(error => {
    document.getElementById("status").innerText = "❌ Error submitting vote. Try again!";
    btn.disabled = false;
    btn.innerText = "Submit Vote";
  });
}
