function openBottomSheet(sheet_id) {
    var bottomSheet = $('#' + sheet_id);
    bottomSheet.css('display', "block");
    setTimeout(() => {
        bottomSheet.css("margin-top", ($(window).height() - 140) + "px");
    }, 50)
}

function hideBottomSheet(sheet_id) {
    var bottomSheet = $('#' + sheet_id);
    bottomSheet.css("margin-top", $(window).height() + "px");
    setTimeout(() => {
        bottomSheet.css('display', 'none');
    }, 300)
    if (sheet_id == "places-sheet") {
        showPointsByType('all');
    }
}