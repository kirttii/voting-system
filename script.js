function doGet(e) {
  return ContentService.createTextOutput("Server is running");
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var roll = data.roll;
    var vote = data.vote;

    var sheet = SpreadsheetApp.getActiveSheet();
    var allData = sheet.getDataRange().getValues();

    // 🔒 Check duplicate roll
    for (var i = 1; i < allData.length; i++) {
      if (allData[i][1] == roll) {
        return ContentService.createTextOutput("Already voted");
      }
    }

    // ✅ Save vote
    sheet.appendRow([new Date(), roll, vote]);

    return ContentService.createTextOutput("Success");

  } catch (err) {
    return ContentService.createTextOutput("Error: " + err);
  }
}
