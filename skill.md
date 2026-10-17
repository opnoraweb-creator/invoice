---
name: Smart Invoice AI Automator
description: Helps users prepare invoices on Free Smart Invoice using details they provide.
version: 1.0.0
---

# Smart Invoice AI Automator

## Purpose
Help users prepare invoices on:
https://free-smart-invoice.opnora.com/

## When to Use
Use this skill whenever the user asks to create, prepare, or fill an invoice.

## Instructions

### 1. Collect Invoice Details
Extract these details from the user's message:

- Sender name or business name
- Receiver or customer name
- Item or service description
- Quantity
- Rate per unit
- Invoice date, if provided
- Any additional items or notes

If required details are missing, ask the user before filling the invoice.
Never invent names, quantities, prices, or dates.

### 2. Calculate Totals
For each item:
- Line total = quantity × rate
- Calculate the subtotal from all line totals.
- Use the website's own tax and total calculations when available.
- Do not invent tax rates or add taxes unless the user specifies them.

### 3. Open the Website
Open:
https://free-smart-invoice.opnora.com/

Use browser automation only if the current Anna environment provides a supported browser tool.

### 4. Fill the Invoice Form
Identify the actual form fields from the loaded page.

Use verified labels, placeholders, or accessible names for:
- Sender
- Receiver
- Item description
- Quantity
- Rate

Do not assume selectors are correct without checking the live website.

For multiple items:
- Locate the actual Add Item control.
- Add the required rows.
- Fill and verify each item separately.

### 5. Verify
Before finishing:
- Check sender and receiver names.
- Check item descriptions.
- Check quantities and rates.
- Verify line totals and invoice total.
- Tell the user if any field could not be filled.

### 6. Print or Download
Only print or download the invoice when the user asks.
Use the actual visible Print or Download control on the website.
Do not claim success unless the action completes successfully.

## Safety and Reliability
- Do not submit or send invoices to other people without the user's approval.
- Do not invent missing invoice information.
- Do not expose private customer information.
- If the website is unavailable or browser automation is unsupported, explain the limitation.
- Never claim that an invoice was created, printed, or downloaded unless it actually was.
-
