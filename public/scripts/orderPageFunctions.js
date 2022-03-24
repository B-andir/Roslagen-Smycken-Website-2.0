function ToggleElement(targetElement) {
    let element = document.getElementById(targetElement)

    element.style.display = element.style.display == "none" ? "block" : "none";
}

function ShowPriceEstimate(sliderValue, productUID, priceValue) {
    let priceEstimate = sliderValue * priceValue;
    document.getElementById((productUID + "lengthDisplay")).innerHTML = sliderValue + "cm";
    document.getElementById((productUID + "PriceEstimate")).innerHTML = priceEstimate;
}

function BuyItem(productID, productUID) {
    let selectedLength = document.getElementById((productUID + "Slider")).value;
    
    loading(true);

    fetch('/api/order/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            productID: productID,
            selectedLength: selectedLength,
        })
    }).then(res => res.json())
      .then(res => {
        loading(false);
        window.open(res.targetURL, "_blank", "popup=yes,scrollbars=yes,status=yes,left=500,top=300");
    })
}
