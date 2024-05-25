$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8000/api/cars",
        method: "GET",
        success: function(data) {
            onReset(data);
            populateMakeDropdown(data);
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });

    function onReset(data) {

        let makeDropdown = $("#make-dropdown");
        let yearDropdown = $("#year-dropdown");
        let modelDropdown = $("#model-dropdown");
        let variantDropdown = $("#variant-dropdown");
        let priceValue = $("#price-value");
    
        makeDropdown.empty().append("<option value=''>Select Make</option>");
        yearDropdown.empty().append("<option value=''>Select Year</option>");
        modelDropdown.empty().append("<option value=''>Select Model</option>");
        variantDropdown.empty().append("<option value=''>Select Variant</option>");
        priceValue.val("");

        populateMakeDropdown(data);
    }

    function populateMakeDropdown(data) {
        let makes = [...new Set(data.map(car => car.make))];
        let makeDropdown = $("#make-dropdown");
        let modelDropdown = $("#model-dropdown");
        let variantDropdown = $("#variant-dropdown");
        let priceValue = $("#price-value");

        makeDropdown.empty();

        makeDropdown.append("<option value=''>Select Make</option>");
        makes.forEach(make => {
            makeDropdown.append(`<option value="${make}">${make}</option>`);
        });

        makeDropdown.change(function() {
            let selectedMake = $(this).val();
            let filteredYears = data.filter(car => car.make === selectedMake);
            populateYearDropdown(filteredYears);
            modelDropdown.empty().append("<option value=''>Select Model</option>");
            variantDropdown.empty().append("<option value=''>Select Variant</option>");
            priceValue.val("");
        });
    }

    function populateYearDropdown(data) {
        let years = [...new Set(data.map(car => car.year))];
        years.sort((a, b) => b - a);
        let yearDropdown = $("#year-dropdown");
        let variantDropdown = $("#variant-dropdown");
        let priceValue = $("#price-value");
        yearDropdown.empty();
        yearDropdown.append("<option value=''>Select Year</option>");
        years.forEach(year => {
            yearDropdown.append(`<option value="${year}">${year}</option>`);
        });

        yearDropdown.change(function() {
            let selectedYear = parseInt($(this).val(), 10);
            let selectedMake = $("#make-dropdown").val();
            let filteredModels = data.filter(car => car.make === selectedMake && car.year === selectedYear);
            populateModelDropdown(filteredModels);
            variantDropdown.empty().append("<option value=''>Select Variant</option>");
            priceValue.val("");
        });
    }

    function populateModelDropdown(data) {
        let models = [...new Set(data.map(car => car.model))];
        let modelDropdown = $("#model-dropdown");
        let priceValue = $("#price-value");

        modelDropdown.empty();
        modelDropdown.append("<option value=''>Select Model</option>");
        models.forEach(model => {
            modelDropdown.append(`<option value="${model}">${model}</option>`);
        });

        modelDropdown.change(function() {
            let selectedModel = $(this).val();
            let selectedMake = $("#make-dropdown").val();
            let selectedYear = parseInt($("#year-dropdown").val());
            let filteredVariants = data.filter(car => car.make === selectedMake && car.year === selectedYear && car.model === selectedModel);
            populateVariantDropdown(filteredVariants);
            priceValue.val("");
        });
    }

    function populateVariantDropdown(data) {
        let variants = [...new Set(data.map(car => car.variant))];
        let variantDropdown = $("#variant-dropdown");

        variantDropdown.empty();
        variantDropdown.append("<option value=''>Select Variant</option>");
        variants.forEach(variant => {
            variantDropdown.append(`<option value="${variant}">${variant}</option>`);
        });

        variantDropdown.change(function() {
            let selectedVariant = $(this).val();
            let selectedMake = $("#make-dropdown").val();
            let selectedYear = parseInt($("#year-dropdown").val());
            let selectedModel = $("#model-dropdown").val();
            let filteredPrices = data.filter(car => car.make === selectedMake && car.year === selectedYear && car.model === selectedModel && car.variant === selectedVariant);
            populatePriceDropdown(filteredPrices);
        });
    }

    function formatNumberWithCommas(number) {

        let formattedNumber = parseFloat(number).toFixed(2);

        formattedNumber = parseInt(formattedNumber, 10).toString();

        return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function populatePriceDropdown(data) {
        
        let priceValue = $("#price-value");
        let price = data.length > 0 ? data[0].price : 'N/A';
        let forNum = formatNumberWithCommas(price);
        priceValue.val(forNum);
    }

    $("#reset-button").click(function() {
        $("#reset-button").blur();
        $.ajax({
            url: "http://localhost:8000/api/cars",
            method: "GET",
            success: function(data) {
                onReset(data);
            },
            error: function(error) {
                console.error("Error fetching data:", error);
            }
        });
    });

});
