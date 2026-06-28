# Vadi Masala Google Sheets Order Sync

Target sheet:
https://docs.google.com/spreadsheets/d/1Er9GCF4kyMrLLWKE7mdJxSRRa_451-s3OhmQk57MWSU/edit

## Deploy the webhook

1. Open the target sheet and choose **Extensions > Apps Script**.
2. Replace `Code.gs` with the contents of `scripts/google-sheets-webhook.gs`.
3. Open **Project Settings > Script Properties**.
4. Add `WEBHOOK_TOKEN` with a long random value.
5. Choose **Deploy > New deployment > Web app**.
6. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
7. Deploy and copy the URL ending in `/exec`.

## Configure Vercel

Add these production environment variables, then redeploy:

```text
GOOGLE_SHEETS_WEBHOOK_URL=<Apps Script /exec URL>
GOOGLE_SHEETS_WEBHOOK_TOKEN=<same Script Property value>
```

Opening the website admin panel backfills all Supabase orders. New paid
orders and later order-status updates are then upserted by Order ID.
