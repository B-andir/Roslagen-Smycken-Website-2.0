function ToggleElement(targetElement) {
    let element = document.getElementById(targetElement)

    element.style.display = element.style.display == "none" ? "block" : "none";
}

function ShowPriceEstimate(sliderValue, productUID, priceValue) {
    let priceEstimate = sliderValue * priceValue;
    document.getElementById((productUID + "lengthDisplay")).innerHTML = sliderValue + "cm";
    document.getElementById((productUID + "PriceEstimate")).innerHTML = priceEstimate;
}
