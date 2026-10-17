---
name: Smart Billing Automator
tool_id: smart-billing-skill
description: Automates invoice generation on free-smart-invoice.opnora.com
execution_mode: browser
capabilities: ["browser_automation", "form_filling"]
---

# Smart Billing Automator

## Purpose
Help users create invoices using:
https://free-smart-invoice.opnora.com/

## Workflow

1. Read the user's request and extract:
   - Sender or business name
   - Receiver or customer name
   - Item description
   - Quantity
   - Rate per unit
   - Invoice date, if provided

2. Ask the user for any missing required details. Never invent invoice information.

3. Open the invoice website using the supported browser navigation tool.

4. Inspect the loaded page and identify the actual invoice form fields. Do not assume selectors without verification.

5. Fill the sender, receiver, item description, quantity, and rate fields using the supported browser fill tool.

6. For multiple items, locate and use the actual Add Item button.

7. Verify all entered values and totals.

8. Use the actual Print or Download control only when the user asks.

## Safety

- Never send an invoice to another person without user approval.
- Do not submit any irreversible action without confirmation.
- Do not claim success unless the browser tool confirms it.
- If browser automation is unavailable, explain the limitation.
-
