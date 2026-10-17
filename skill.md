// --- Anna AI Integration: Auto-fill from URL ---
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    
    // Check if URL has items (e.g., ?i1=...)
    if (params.has('i1')) {
        // 1. Set Currency if provided
        if (params.has('curr')) {
            const currSelect = document.querySelector('.currency-select') || document.querySelector('select');
            if (currSelect) {
                currSelect.value = params.get('curr');
                currSelect.dispatchEvent(new Event('change'));
            }
        }

        // 2. Loop through parameters to fill rows
        for (let n = 1; n <= 20; n++) {
            const name = params.get(`i${n}`);
            const price = params.get(`p${n}`);
            const qty = params.get(`q${n}`) || 1;

            if (name && price) {
                // Target rows - standard invoice structure usually has an 'item-row' or similar
                const rows = document.querySelectorAll('.item-row') || document.querySelectorAll('table tr:not(:first-child)');
                const targetRow = rows[n-1];

                if (targetRow) {
                    const inputs = targetRow.querySelectorAll('input');
                    if (inputs.length >= 3) {
                        inputs[0].value = decodeURIComponent(name); // Description
                        inputs[1].value = price;                   // Rate
                        inputs[2].value = qty;                     // Qty
                        
                        // Trigger input events to fire your existing calculation logic
                        inputs[1].dispatchEvent(new Event('input'));
                        inputs[1].dispatchEvent(new Event('change'));
                        inputs[2].dispatchEvent(new Event('input'));
                    }
                }
            }
        }
    }
});
