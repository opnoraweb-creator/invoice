// Automatically current date set karna
document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-IN');

// New Item Row Add karne ka function
function addNewRow() {
    const tbody = document.getElementById('invoiceItems');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td contenteditable="true" class="item-name">Naya Item Type Karein</td>
        <td contenteditable="true" class="item-qty" oninput="calculateRowTotal(this)">1</td>
        <td contenteditable="true" class="item-rate" oninput="calculateRowTotal(this)">0.00</td>
        <td class="item-total">0.00</td>
        <td class="no-print"><button class="btn btn-delete" onclick="deleteRow(this)">X</button></td>
    `;
    
    tbody.appendChild(row);
    calculateGrandTotal();
}

// Single Row ka Multiply calculate karna
function calculateRowTotal(element) {
    const row = element.parentElement;
    const qty = parseFloat(row.querySelector('.item-qty').innerText) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').innerText) || 0;
    
    const total = qty * rate;
    row.querySelector('.item-total').innerText = total.toFixed(2);
    
    calculateGrandTotal();
}

// Row Delete karne ka function
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    calculateGrandTotal();
}

// Subtotal, Live GST % aur Grand Total calculate karne ka main logic
function calculateGrandTotal() {
    const totals = document.querySelectorAll('.item-total');
    let subTotal = 0;
    
    // 1. Sabhi items ka bina tax wala total nikalein
    totals.forEach(total => {
        subTotal += parseFloat(total.innerText) || 0;
    });
    document.getElementById('subTotal').innerText = subTotal.toFixed(2);
    
    // 2. User dwara manually type kiya gaya GST % nikalein
    let gstInput = document.getElementById('gstPercentage').innerText;
    let gstPercent = parseFloat(gstInput) || 0;
    
    // 3. GST Amount aur Net Grand Total calculate karein
    let gstAmount = (subTotal * gstPercent) / 100;
    let grandTotal = subTotal + gstAmount;
    
    // 4. Screen par values update karein
    document.getElementById('gstAmount').innerText = gstAmount.toFixed(2);
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
}

// Website khulte hi automatic ek khali row ban jaye
window.onload = function() {
    addNewRow();
};
