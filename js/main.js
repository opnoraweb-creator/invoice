(() => {
    "use strict";

    const STORAGE_KEY = "opnora_freeinvoice_v2";
    const $ = (id) => document.getElementById(id);

    const fields = [
        "shopName",
        "shopAddress",
        "shopContact",
        "invoiceNumber",
        "customerName",
        "customerContact"
    ];

    function todayString() {
        return new Date().toLocaleDateString("en-IN");
    }

    function getCurrencySymbol() {
        const selected = $("currencySelect").selectedOptions[0];
        return selected ? (selected.dataset.symbol || "₹") : "₹";
    }

    function updateCurrencySymbols() {
        const symbol = getCurrencySymbol();

        document.querySelectorAll(".currency-symbol").forEach((element) => {
            element.textContent = symbol;
        });
    }

    function numberValue(text) {
        const value = Number.parseFloat(
            String(text ?? "").replace(/,/g, "").trim()
        );

        return Number.isFinite(value) ? value : 0;
    }

    function getRowsData() {
        return Array.from(
            $("invoiceItems").querySelectorAll("tr")
        ).map((row) => ({
            name: row.querySelector(".item-name").textContent,
            qty: row.querySelector(".item-qty").textContent,
            rate: row.querySelector(".item-rate").textContent
        }));
    }

    function readInvoice() {
        const data = {};

        fields.forEach((id) => {
            data[id] = $(id).textContent;
        });

        data.currency = $("currencySelect").value;
        data.taxType = $("taxType").value;
        data.taxRate = $("taxRate").value;
        data.rows = getRowsData();

        return data;
    }

    function saveInvoice() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(readInvoice())
            );

            $("saveStatus").textContent =
                "Auto-saved in this browser.";
        } catch (error) {
            $("saveStatus").textContent =
                "Could not save. Check browser storage settings.";
        }
    }

    function addNewRow(data = {}) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.contentEditable = "true";
        nameCell.className = "item-name";
        nameCell.spellcheck = false;
        nameCell.textContent = data.name ?? "Naya Item Type Karein";

        const qtyCell = document.createElement("td");
        qtyCell.contentEditable = "true";
        qtyCell.className = "item-qty";
        qtyCell.textContent = data.qty ?? "1";
        qtyCell.inputMode = "decimal";

        const rateCell = document.createElement("td");
        rateCell.contentEditable = "true";
        rateCell.className = "item-rate";
        rateCell.textContent = data.rate ?? "0.00";
        rateCell.inputMode = "decimal";

        const totalCell = document.createElement("td");
        totalCell.className = "item-total-cell";

        const symbol = document.createElement("span");
        symbol.className = "currency-symbol";
        symbol.textContent = getCurrencySymbol();

        const total = document.createElement("span");
        total.className = "item-total";
        total.textContent = "0.00";

        totalCell.append(symbol, total);

        const actionCell = document.createElement("td");
        actionCell.className = "no-print";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-delete";
        deleteButton.textContent = "X";
        deleteButton.setAttribute("aria-label", "Delete item");

        deleteButton.addEventListener("click", () => {
            row.remove();

            if (!$("invoiceItems").querySelector("tr")) {
                addNewRow();
            }

            calculateGrandTotal();
            saveInvoice();
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            qtyCell,
            rateCell,
            totalCell,
            actionCell
        );

        $("invoiceItems").appendChild(row);

        calculateRowTotal(row);

        return row;
    }

    function calculateRowTotal(row) {
        const qty = numberValue(
            row.querySelector(".item-qty").textContent
        );

        const rate = numberValue(
            row.querySelector(".item-rate").textContent
        );

        const total = qty * rate;

        row.querySelector(".item-total").textContent =
            total.toFixed(2);

        calculateGrandTotal();
    }

    function calculateGrandTotal() {
        let subtotal = 0;

        $("invoiceItems").querySelectorAll(".item-total").forEach((item) => {
            subtotal += numberValue(item.textContent);
        });

        const taxRate = Math.min(
            100,
            Math.max(0, numberValue($("taxRate").value))
        );

        const taxAmount = subtotal * taxRate / 100;
        const grandTotal = subtotal + taxAmount;

        $("subTotal").textContent = subtotal.toFixed(2);
        $("taxAmount").textContent = taxAmount.toFixed(2);
        $("grandTotal").textContent = grandTotal.toFixed(2);

        $("taxRateDisplay").textContent =
            $("taxRate").value || "0";

        $("taxLabel").textContent = $("taxType").value;

        updateCurrencySymbols();
    }

    function restoreInvoice() {
        let saved = null;

        try {
            saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "null"
            );
        } catch (error) {
            saved = null;
        }

        if (!saved || typeof saved !== "object") {
            $("currentDate").textContent = todayString();
            addNewRow();
            calculateGrandTotal();
            return;
        }

        fields.forEach((id) => {
            if (typeof saved[id] === "string") {
                $(id).textContent = saved[id];
            }
        });

        if (saved.currency) {
            const currencyOption = Array.from(
                $("currencySelect").options
            ).find((option) => option.value === saved.currency);

            if (currencyOption) {
                $("currencySelect").value = saved.currency;
            }
        }

        if (saved.taxType) {
            const taxOption = Array.from(
                $("taxType").options
            ).find((option) => option.value === saved.taxType);

            if (taxOption) {
                $("taxType").value = saved.taxType;
            }
        }

        if (saved.taxRate !== undefined) {
            $("taxRate").value = saved.taxRate;
        }

        $("currentDate").textContent = todayString();
        $("invoiceItems").innerHTML = "";

        if (Array.isArray(saved.rows) && saved.rows.length > 0) {
            saved.rows.forEach((item) => addNewRow(item));
        } else {
            addNewRow();
        }

        calculateGrandTotal();

        $("saveStatus").textContent =
            "Saved invoice restored from this browser.";
    }

    function applyDefaultTaxRate() {
        const selected = $("taxType").selectedOptions[0];

        $("taxRate").value = selected
            ? selected.dataset.defaultRate
            : "0";

        calculateGrandTotal();
        saveInvoice();
    }

    function clearInvoice(askFirst = true) {
        if (
            askFirst &&
            !window.confirm(
                "Clear this invoice? Its saved details will be removed."
            )
        ) {
            return;
        }

        const defaults = {
            shopName: "Aapki Shop Ka Naam",
            shopAddress: "RIICO Industrial Area, Pali, Rajasthan",
            shopContact: "Mobile: +91 9999999999",
            invoiceNumber: "#101",
            customerName: "Customer Name",
            customerContact: "Mobile No."
        };

        fields.forEach((id) => {
            $(id).textContent = defaults[id];
        });

        $("currencySelect").value = "INR";
        $("taxType").value = "GST";
        $("taxRate").value = "18";
        $("currentDate").textContent = todayString();

        $("invoiceItems").innerHTML = "";

        addNewRow();
        calculateGrandTotal();
        saveInvoice();
    }

    function newInvoice() {
        if (
            !window.confirm(
                "Start a new invoice? The current invoice will be replaced."
            )
        ) {
            return;
        }

        const oldNumber = $("invoiceNumber").textContent.trim();
        const match = oldNumber.match(/(\d+)\s*$/);
        const nextNumber = match
            ? `#${Number(match[1]) + 1}`
            : "#101";

        clearInvoice(false);

        $("invoiceNumber").textContent = nextNumber;
        $("customerName").textContent = "Customer Name";
        $("customerContact").textContent = "Mobile No.";

        saveInvoice();
    }

    function init() {
        restoreInvoice();

        $("addItemBtn").addEventListener("click", () => {
            addNewRow();
            saveInvoice();
        });

        $("printBtn").addEventListener("click", () => {
            window.print();
        });

        $("currencySelect").addEventListener("change", () => {
            updateCurrencySymbols();
            saveInvoice();
        });

        $("taxType").addEventListener("change", applyDefaultTaxRate);

        $("taxRate").addEventListener("input", () => {
            calculateGrandTotal();
            saveInvoice();
        });

        $("invoiceItems").addEventListener("input", (event) => {
            const row = event.target.closest("tr");

            if (
                row &&
                (
                    event.target.classList.contains("item-qty") ||
                    event.target.classList.contains("item-rate")
                )
            ) {
                calculateRowTotal(row);
            }

            saveInvoice();
        });

        document.addEventListener("input", (event) => {
            if (
                event.target.isContentEditable &&
                !event.target.closest("#invoiceItems")
            ) {
                saveInvoice();
            }
        });

        document.addEventListener("blur", (event) => {
            if (event.target.isContentEditable) {
                saveInvoice();
            }
        }, true);

        $("newInvoiceBtn").addEventListener("click", newInvoice);

        $("clearInvoiceBtn").addEventListener("click", () => {
            clearInvoice(true);
        });

        updateCurrencySymbols();
        calculateGrandTotal();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
