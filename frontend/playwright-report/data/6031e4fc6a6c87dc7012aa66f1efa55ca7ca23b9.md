# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-portal-journey.spec.js >> Consumer portal end-to-end journey >> signs in, reviews notifications, billing and receipts, then explores consumption charts
- Location: src\test\e2e\consumer-portal-journey.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img [ref=e8]
          - generic [ref=e10]:
            - heading "WaterWise" [level=1] [ref=e11]
            - paragraph [ref=e12]: Sucol Water System
        - generic [ref=e13]:
          - generic [ref=e14]: consumer
          - button "Open system notifications" [ref=e15]:
            - img [ref=e16]
            - generic [ref=e19]: "1"
          - button "Open account menu" [ref=e21]:
            - img [ref=e23]
            - img [ref=e26]
    - generic [ref=e28]:
      - complementary [ref=e29]:
        - generic [ref=e30]:
          - navigation "Consumer navigation" [ref=e31]:
            - list [ref=e32]:
              - listitem [ref=e33]:
                - link "Usage Metrics" [ref=e34] [cursor=pointer]:
                  - /url: /consumer/usage-metrics
                  - img [ref=e35]
                  - generic [ref=e37]: Usage Metrics
              - listitem [ref=e38]:
                - link "Billing Ledger" [ref=e39] [cursor=pointer]:
                  - /url: /consumer/billing-ledger
                  - img [ref=e40]
                  - generic [ref=e43]: Billing Ledger
              - listitem [ref=e44]:
                - link "Profile Details" [ref=e45] [cursor=pointer]:
                  - /url: /consumer/profile-details
                  - img [ref=e46]
                  - generic [ref=e51]: Profile Details
              - listitem [ref=e52]:
                - link "Analytics" [ref=e53] [cursor=pointer]:
                  - /url: /admin/analytics
                  - img [ref=e54]
                  - generic [ref=e59]: Analytics
          - generic [ref=e61]:
            - img [ref=e63]
            - generic [ref=e66]:
              - paragraph [ref=e67]: Juan Dela Cruz
              - paragraph [ref=e68]: Consumer
      - main [ref=e69]:
        - generic [ref=e71]:
          - heading "Billing Ledger" [level=1] [ref=e73]
          - generic [ref=e74]:
            - generic [ref=e76]:
              - generic [ref=e77]:
                - generic [ref=e78]:
                  - img [ref=e79]
                  - generic [ref=e82]: Outstanding Balance
                - heading "₱450.00" [level=2] [ref=e83]
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - img [ref=e86]
                  - generic [ref=e88]: Upcoming Due Date
                - paragraph [ref=e89]: July 25, 2026
            - generic [ref=e90]:
              - generic [ref=e91]:
                - generic [ref=e92]:
                  - paragraph [ref=e93]: Billing records
                  - heading "Billing History" [level=3] [ref=e94]
                - button "View Official Receipt" [ref=e95]
              - table [ref=e97]:
                - rowgroup [ref=e98]:
                  - row "Billing Period Consumer Reading Date Consumption Amount Due Status Action" [ref=e99]:
                    - columnheader "Billing Period" [ref=e100]
                    - columnheader "Consumer" [ref=e101]
                    - columnheader "Reading Date" [ref=e102]
                    - columnheader "Consumption" [ref=e103]
                    - columnheader "Amount Due" [ref=e104]
                    - columnheader "Status" [ref=e105]
                    - columnheader "Action" [ref=e106]
                - rowgroup [ref=e107]:
                  - row "June 2026 Iverene Grace M. Causapin 2026-06-30 24.5 m³ ₱450.00 Overdue Unavailable" [ref=e108]:
                    - cell "June 2026" [ref=e109]
                    - cell "Iverene Grace M. Causapin" [ref=e110]
                    - cell "2026-06-30" [ref=e111]
                    - cell "24.5 m³" [ref=e112]
                    - cell "₱450.00" [ref=e113]
                    - cell "Overdue" [ref=e114]:
                      - generic [ref=e115]: Overdue
                    - cell "Unavailable" [ref=e116]:
                      - button "Unavailable" [disabled] [ref=e117]
                  - row "May 2026 Iverene Grace M. Causapin 2026-05-31 22.1 m³ ₱390.00 Paid View Receipt" [ref=e118]:
                    - cell "May 2026" [ref=e119]
                    - cell "Iverene Grace M. Causapin" [ref=e120]
                    - cell "2026-05-31" [ref=e121]
                    - cell "22.1 m³" [ref=e122]
                    - cell "₱390.00" [ref=e123]
                    - cell "Paid" [ref=e124]:
                      - generic [ref=e125]: Paid
                    - cell "View Receipt" [ref=e126]:
                      - button "View Receipt" [ref=e127]
                  - row "April 2026 Iverene Grace M. Causapin 2026-04-30 21.4 m³ ₱370.00 Paid View Receipt" [ref=e128]:
                    - cell "April 2026" [ref=e129]
                    - cell "Iverene Grace M. Causapin" [ref=e130]
                    - cell "2026-04-30" [ref=e131]
                    - cell "21.4 m³" [ref=e132]
                    - cell "₱370.00" [ref=e133]
                    - cell "Paid" [ref=e134]:
                      - generic [ref=e135]: Paid
                    - cell "View Receipt" [ref=e136]:
                      - button "View Receipt" [ref=e137]
    - complementary "Notification center" [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]:
          - paragraph [ref=e142]: Notification Center
          - paragraph [ref=e143]: 1 unread alert
        - button "Close notification center" [ref=e144]:
          - img [ref=e145]
      - generic [ref=e148]:
        - heading "Updates for you" [level=3] [ref=e149]
        - paragraph [ref=e150]: Bills and community notices in one place.
        - generic [ref=e151]:
          - generic [ref=e152]:
            - heading "Account bills" [level=4] [ref=e153]
            - generic [ref=e155] [cursor=pointer]:
              - img [ref=e157]
              - generic [ref=e160]:
                - heading "New meter reading" [level=5] [ref=e161]
                - paragraph [ref=e162]: Your June 2026 meter reading is now available.
              - button "Delete New meter reading" [ref=e163]:
                - img [ref=e164]
          - generic [ref=e166]:
            - heading "Community announcements" [level=4] [ref=e167]
            - generic [ref=e169] [cursor=pointer]:
              - img [ref=e171]
              - generic [ref=e174]:
                - heading "Distribution advisory" [level=5] [ref=e175]
                - paragraph [ref=e176]: Purok 3 maintenance window is scheduled for field validation.
              - button "Delete Distribution advisory" [ref=e177]:
                - img [ref=e178]
  - generic [ref=e180]: "0"
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.describe("Consumer portal end-to-end journey", () => {
  4   |   test("signs in, reviews notifications, billing and receipts, then explores consumption charts", async ({
  5   |     page,
  6   |   }) => {
  7   |     const pageErrors = [];
  8   |     page.on("pageerror", (error) => pageErrors.push(error.message));
  9   | 
  10  |     const resetResponse = await page.request.post("/api/test/notifications/reset");
  11  |     expect(resetResponse.status()).toBe(204);
  12  | 
  13  |     await page.goto("/login");
  14  |     await expect(
  15  |       page.getByRole("heading", { name: "Sign in to your account" }),
  16  |     ).toBeVisible();
  17  |     await page.getByLabel("Email or username").fill("tenant@gmail.com");
  18  |     const passwordInput = page.getByLabel("Password", { exact: true });
  19  |     await passwordInput.fill("tenant123");
  20  |     await expect(passwordInput).toHaveAttribute("type", "password");
  21  |     await page.getByRole("button", { name: "Show password" }).click();
  22  |     await expect(passwordInput).toHaveAttribute("type", "text");
  23  |     await page.getByRole("button", { name: "Hide password" }).click();
  24  |     await expect(passwordInput).toHaveAttribute("type", "password");
  25  | 
  26  |     const historyResponse = page.waitForResponse(
  27  |       (response) =>
  28  |         response.url().endsWith("/api/consumption") && response.status() === 200,
  29  |     );
  30  | 
  31  |     await page.getByRole("button", { name: "Sign in", exact: true }).click();
  32  |     await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);
  33  |     await historyResponse;
  34  | 
  35  |     await expect(page.getByRole("heading", { name: "Usage Metrics" })).toBeVisible();
  36  |     await expect(page.getByTestId("analytics-grid")).toBeVisible();
  37  |     await expect(page.getByTestId("trend-graph-container")).toBeVisible();
  38  |     await expect(page.getByTestId("graph-node")).toHaveCount(7);
  39  | 
  40  |     await page.getByTestId("notification-trigger").click();
  41  |     await expect(page.getByTestId("section-bills")).toContainText("New meter reading");
  42  |     await expect(page.getByTestId("section-announcements")).toContainText(
  43  |       "Distribution advisory",
  44  |     );
  45  | 
  46  |     const billingNotification = page.getByTestId("notification-card-2026001");
  47  |     const announcementNotification = page.getByTestId("notification-card-2026002");
  48  |     await expect(billingNotification).toHaveAttribute("data-is-read", "false");
  49  |     await expect(announcementNotification).toHaveAttribute("data-is-read", "false");
  50  |     await expect(page.getByTestId("unread-badge")).toHaveText("2");
  51  | 
  52  |     const billingReadResponse = page.waitForResponse(
  53  |       (response) =>
  54  |         response.url().endsWith("/api/notifications/2026001/read") &&
  55  |         response.request().method() === "PUT" &&
  56  |         response.status() === 200,
  57  |     );
  58  |     await billingNotification.click();
  59  |     await billingReadResponse;
  60  | 
  61  |     await expect(page).toHaveURL(/\/consumer\/billing-ledger\?receipt=official$/);
  62  |     await expect(
  63  |       page.getByRole("heading", { name: "Sucol Water System Official Receipt" }),
  64  |     ).toBeVisible();
  65  |     await page.getByRole("button", { name: "Close official receipt" }).click();
  66  | 
  67  |     await page.getByTestId("notification-trigger").click();
  68  |     await expect(billingNotification).toHaveAttribute("data-is-read", "true");
  69  |     await expect(page.getByTestId("unread-badge")).toHaveText("1");
  70  | 
> 71  |     const announcementReadResponse = page.waitForResponse(
      |                                           ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  72  |       (response) =>
  73  |         response.url().endsWith("/api/notifications/2026002/read") &&
  74  |         response.request().method() === "PUT" &&
  75  |         response.status() === 200,
  76  |     );
  77  |     await announcementNotification.click();
  78  |     await announcementReadResponse;
  79  |     await expect(announcementNotification).toHaveAttribute("data-is-read", "true");
  80  |     await expect(page.getByTestId("unread-badge")).toHaveCount(0);
  81  |     await page.getByRole("button", { name: "Close notification center" }).click();
  82  | 
  83  |     await page.getByRole("link", { name: "Billing Ledger" }).click();
  84  |     await expect(page).toHaveURL(/\/consumer\/billing-ledger$/);
  85  |     await expect(page.getByRole("heading", { name: "Billing Ledger" })).toBeVisible();
  86  | 
  87  |     await expect(page.getByTestId("current-billing-card")).toBeVisible();
  88  |     await expect(page.getByTestId("outstanding-balance")).toContainText("450.00");
  89  |     await expect(page.getByTestId("due-date")).toHaveText("July 25, 2026");
  90  |     await expect(page.getByTestId("billing-history-table")).toBeVisible();
  91  |     await expect(page.getByTestId("history-row")).toHaveCount(3);
  92  |     await expect(page.getByTestId("view-receipt-INV-2026-006")).toBeDisabled();
  93  | 
  94  |     await page.getByTestId("view-receipt-INV-2026-005").click();
  95  |     await expect(page.getByTestId("receipt-modal-content")).toBeVisible();
  96  |     await expect(page.getByTestId("receipt-invoice")).toHaveText("INV-2026-005");
  97  |     await expect(page.getByTestId("receipt-diff")).toContainText("22.1");
  98  |     await expect(page.getByTestId("receipt-total-payable")).toContainText("390.00");
  99  |     await page.getByRole("button", { name: "Close receipt" }).click();
  100 |     await expect(page.getByTestId("receipt-modal-content")).toBeHidden();
  101 | 
  102 |     await page.getByRole("button", { name: "View Official Receipt" }).click();
  103 |     await expect(page).toHaveURL(/\/consumer\/billing-ledger\?receipt=official$/);
  104 |     await expect(
  105 |       page.getByRole("heading", { name: "Sucol Water System Official Receipt" }),
  106 |     ).toBeVisible();
  107 |     await expect(page.getByTestId("receipt-meter-name")).toHaveText("SWS-MTR-0412");
  108 |     await expect(page.getByTestId("receipt-final-total")).toContainText("450.00");
  109 |     await page.getByRole("button", { name: "Close official receipt" }).click();
  110 |     await expect(page).toHaveURL(/\/consumer\/billing-ledger$/);
  111 | 
  112 |     const refreshedHistoryResponse = page.waitForResponse(
  113 |       (response) =>
  114 |         response.url().endsWith("/api/consumption") && response.status() === 200,
  115 |     );
  116 |     await page.getByRole("link", { name: "Usage Metrics" }).click();
  117 |     await refreshedHistoryResponse;
  118 |     await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);
  119 | 
  120 |     const yearFilter = page.getByTestId("year-filter");
  121 |     await expect(yearFilter.locator("option")).toHaveText(["2025", "2026"]);
  122 |     await yearFilter.selectOption("2025");
  123 |     await expect(page.getByTestId("graph-node")).toHaveCount(12);
  124 |     await expect(page.getByTestId("axis-month-label").first()).toHaveText("January 2025");
  125 |     await expect(page.getByTestId("axis-month-label").last()).toHaveText("December 2025");
  126 | 
  127 |     await yearFilter.selectOption("2026");
  128 |     await expect(page.getByTestId("graph-node")).toHaveCount(7);
  129 |     await expect(page.getByTestId("axis-month-label").last()).toHaveText("July 2026");
  130 | 
  131 |     await page.getByRole("button", { name: "Open account menu" }).click();
  132 |     await page.getByRole("button", { name: "Log out" }).click();
  133 |     await expect(page).toHaveURL(/\/login$/);
  134 |     await page.getByLabel("Email or username").fill("tenant@gmail.com");
  135 |     await page.getByLabel("Password", { exact: true }).fill("tenant123");
  136 |     await page.getByRole("button", { name: "Sign in", exact: true }).click();
  137 |     await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);
  138 | 
  139 |     await page.getByTestId("notification-trigger").click();
  140 |     await expect(page.getByTestId("notification-card-2026001")).toHaveAttribute(
  141 |       "data-is-read",
  142 |       "true",
  143 |     );
  144 |     await expect(page.getByTestId("notification-card-2026002")).toHaveAttribute(
  145 |       "data-is-read",
  146 |       "true",
  147 |     );
  148 |     await expect(page.getByTestId("unread-badge")).toHaveCount(0);
  149 | 
  150 |     const deleteResponse = page.waitForResponse(
  151 |       (response) =>
  152 |         response.url().endsWith("/api/notifications/2026002") &&
  153 |         response.request().method() === "DELETE" &&
  154 |         response.status() === 200,
  155 |     );
  156 |     await page.getByRole("button", { name: "Delete Distribution advisory" }).click();
  157 |     await deleteResponse;
  158 |     await expect(page.getByTestId("notification-card-2026002")).toHaveCount(0);
  159 |     await page.getByRole("button", { name: "Close notification center" }).click();
  160 | 
  161 |     await page.getByRole("button", { name: "Open account menu" }).click();
  162 |     await page.getByRole("button", { name: "Log out" }).click();
  163 |     await page.getByLabel("Email or username").fill("tenant@gmail.com");
  164 |     await page.getByLabel("Password", { exact: true }).fill("tenant123");
  165 |     await page.getByRole("button", { name: "Sign in", exact: true }).click();
  166 |     await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);
  167 |     await page.getByTestId("notification-trigger").click();
  168 |     await expect(page.getByTestId("notification-card-2026002")).toHaveCount(0);
  169 |     await expect(page.getByTestId("notification-card-2026001")).toBeVisible();
  170 |     expect(pageErrors).toEqual([]);
  171 |   });
```