import { Section, Text } from "@react-email/components";
import type { OrderRecord } from "@/lib/orders";
import { money } from "@/lib/format";
import type { SiteInfo } from "@/lib/settings";
import { siteOrigin } from "@/lib/seo";
import { EmailBody, EmailShell, EmailButton as EmailButtonInline } from "./Shell";
import { ItemsRows, TotalsRows, paymentLabel } from "./order-shared";

const siteUrl = siteOrigin();

/** Email 2 — new order alert (admin). */
export function NewOrderAlertEmail({
  order,
  site,
}: {
  order: OrderRecord;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview={`New order ${order.reference} — ${order.customer.name}`}
      heading="New order placed."
      reference={order.reference}
      site={site}
      footerNote="Sign in to the dashboard to send payment details and move this order forward."
    >
      <ItemsRows order={order} />
      <TotalsRows order={order} />

      <Section className="mt-5 border-b border-line pb-3">
        <Text className="m-0 text-[14px] font-semibold text-ink">Customer</Text>
        <Text className="m-0 mt-1 text-[14px] leading-relaxed text-muted">
          {order.customer.name}
          <br />
          {order.customer.email}
          {order.customer.phone ? (
            <>
              <br />
              {order.customer.phone}
            </>
          ) : null}
        </Text>
      </Section>

      <Section className="mt-3 border-b border-line pb-3">
        <Text className="m-0 text-[14px] font-semibold text-ink">
          {order.delivery.method === "delivery" ? "Delivery" : "Pickup"}
        </Text>
        <Text className="m-0 mt-1 text-[14px] leading-relaxed text-muted">
          {order.delivery.method === "delivery"
            ? [
                order.delivery.address?.line1,
                [order.delivery.address?.city, order.delivery.address?.state, order.delivery.address?.zip]
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join(", ") || "No address provided"
            : "Customer picks up on Michigan Ave"}
        </Text>
        <Text className="m-0 mt-1 text-[14px] text-muted">
          Chosen payment method: {paymentLabel(order)}
        </Text>
      </Section>

      {order.customer.notes ? (
        <EmailBody>Customer note: “{order.customer.notes}”</EmailBody>
      ) : null}

      <EmailButtonInline href={`${siteUrl}/admin/orders/${order.reference}`}>
        Open in dashboard
      </EmailButtonInline>
    </EmailShell>
  );
}

/** Email 3 — payment instructions (admin-triggered, to client). */
export function PaymentInstructionsEmail({
  order,
  site,
}: {
  order: OrderRecord;
  site?: SiteInfo;
}) {
  const amount = order.payment.amountDue ?? order.total;
  return (
    <EmailShell
      preview={`Payment details for ${order.reference}`}
      heading="Your payment details."
      reference={order.reference}
      site={site}
      footerNote="Questions about payment? Call us and reference your order number."
    >
      <EmailBody>
        Your camper is reserved. Complete payment using the details below and we'll
        start prepping your order right away.
      </EmailBody>

      <Section className="mt-5 border border-line p-4">
        <Text className="m-0 text-[14px] font-semibold text-ink">
          Amount due: {money(amount)}
        </Text>
        {order.payment.dueDate ? (
          <Text className="m-0 mt-1 text-[14px] text-muted">
            Due by {order.payment.dueDate}
          </Text>
        ) : null}
        <Text className="m-0 mt-3 whitespace-pre-line text-[14px] leading-[1.6] text-ink">
          {order.payment.instructions}
        </Text>
      </Section>

      <EmailBody>
        After sending payment, reply to this email with your confirmation number — or
        just wait, we'll confirm receipt automatically once it lands.
      </EmailBody>

      <EmailButtonInline href={`${siteUrl}/track?ref=${order.reference}`}>
        Track your order
      </EmailButtonInline>
    </EmailShell>
  );
}

/** Email 4 — payment confirmed (to client). */
export function PaymentConfirmedEmail({
  order,
  site,
}: {
  order: OrderRecord;
  site?: SiteInfo;
}) {
  const amount = order.payment.amountDue ?? order.total;
  return (
    <EmailShell
      preview={`Payment received — ${order.reference}`}
      heading="Payment received. Thank you."
      reference={order.reference}
      site={site}
      footerNote="Your order is now moving through prep. We'll email you when it's ready."
    >
      <EmailBody>
        We've confirmed your payment of {money(amount)} for order {order.reference}.
        Your camper is being prepped now — most orders are ready for pickup or delivery
        within 48 hours.
      </EmailBody>

      <ItemsRows order={order} />
      <TotalsRows order={order} />

      <EmailButtonInline href={`${siteUrl}/track?ref=${order.reference}`}>
        Track your order
      </EmailButtonInline>
    </EmailShell>
  );
}

/** Email 5 — status update (to client). */
export function StatusUpdateEmail({
  order,
  note,
  site,
}: {
  order: OrderRecord;
  note?: string;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview={`Order ${order.reference} is ${order.status}`}
      heading={`Your order is ${order.status.toLowerCase()}.`}
      reference={order.reference}
      site={site}
      footerNote="Track your order any time with your email address and reference number."
    >
      <EmailBody>
        {note ??
          `Order ${order.reference} has moved to “${order.status}”. Here's where things stand.`}
      </EmailBody>

      <ItemsRows order={order} />
      <TotalsRows order={order} />

      <EmailButtonInline href={`${siteUrl}/track?ref=${order.reference}`}>
        Track your order
      </EmailButtonInline>
    </EmailShell>
  );
}

/** Email 6a — enquiry notice (admin). */
export function EnquiryNoticeEmail({
  name,
  email,
  phone,
  subject,
  message,
  site,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview={`New enquiry from ${name}`}
      heading="New website enquiry."
      site={site}
      footerNote="Reply directly to this email to reach the customer."
    >
      <Section className="border-b border-line pb-3">
        <Text className="m-0 text-[14px] font-semibold text-ink">{subject}</Text>
        <Text className="m-0 mt-1 text-[14px] leading-relaxed text-muted">
          {name} · {email}
          {phone ? <> · {phone}</> : null}
        </Text>
      </Section>
      <EmailBody>{message}</EmailBody>
    </EmailShell>
  );
}

/** Email 6b — enquiry auto-reply (client). */
export function EnquiryAutoReplyEmail({
  name,
  message,
  site,
}: {
  name: string;
  message: string;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview="We received your message"
      heading="Message received."
      site={site}
      footerNote="We answer every enquiry within one business day."
    >
      <EmailBody>
        Thanks, {name.split(" ")[0] || "there"} — we got your message and someone from
        the team will get back to you within one business day.
      </EmailBody>
      <Section className="mt-4 border-t border-line pt-3">
        <Text className="m-0 whitespace-pre-line text-[14px] leading-[1.6] text-muted">
          {message}
        </Text>
      </Section>
    </EmailShell>
  );
}

/** Email 7 — admin reply to an enquiry (client). */
export function EnquiryReplyEmail({
  name,
  reply,
  site,
}: {
  name: string;
  reply: string;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview="Reply about your enquiry"
      heading="We got back to you."
      site={site}
      footerNote="Questions? Just reply to this email — it reaches the lot directly."
    >
      <EmailBody>
        Hi {name.split(" ")[0] || "there"}, here's a note from the team at
        {site?.name ? ` ${site.name}` : " the lot"}:
      </EmailBody>
      <Section className="mt-4 rounded border border-line p-4">
        <Text className="m-0 whitespace-pre-line text-[14px] leading-[1.6] text-ink">
          {reply}
        </Text>
      </Section>
    </EmailShell>
  );
}

/** Email 8 — admin reply to an order's customer (client). */
export function OrderReplyEmail({
  order,
  reply,
  site,
}: {
  order: OrderRecord;
  reply: string;
  site?: SiteInfo;
}) {
  return (
    <EmailShell
      preview={`Reply about order ${order.reference}`}
      heading={`About order ${order.reference}.`}
      reference={order.reference}
      site={site}
      footerNote="Keep your order reference handy — you can track it any time on the site."
    >
      <EmailBody>
        A note from our team about your order
        {order.customer.name ? `, ${order.customer.name.split(" ")[0]}` : ""}:
      </EmailBody>
      <Section className="mt-4 rounded border border-line p-4">
        <Text className="m-0 whitespace-pre-line text-[14px] leading-[1.6] text-ink">
          {reply}
        </Text>
      </Section>
      <EmailButtonInline href={`${siteUrl}/track?ref=${order.reference}`}>
        Track your order
      </EmailButtonInline>
    </EmailShell>
  );
}
