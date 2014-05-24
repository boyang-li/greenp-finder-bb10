function printValue(sliderID, textbox) {
    var x = document.getElementById(textbox);
    var y = document.getElementById(sliderID);
    x.value = y.value;
}

function standardDialog() {
    blackberry.ui.toast.show("Favorite cleared!");
}
