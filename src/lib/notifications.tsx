import { render } from "@react-email/render";
import { sendEmail, toText } from "./mailer";
import type { OrderRecord } from "./orders";
import { getSettings, type SiteInfo } from "./settings";
import {
  EnquiryAutoReplyEmail,
  EnquiryNoticeEmail,
  EnquiryReplyEmail,
  NewOrderAlertEmail,
  OrderReplyEmail,
  PaymentConfirmedEmail,
  PaymentInstructionsEmail,
  StatusUpdateEmail,
} from "@/emails/templates";
import { OrderReceivedEmail } from "@/emails/order-shared";

async function deliver(props: {
  to: string;
  subject: string;
  tag: string;
  template: React.ReactElement;
}) {
  const html = await render(props.template);
  return sendEmail({
    to: props.to,
    subject: props.subject,
    tag: props.tag,
    html,
    text: toText(html),
  });
}

/** Email 1 (client) + email 2 (admin), fired when an order is placed. */
export async function sendOrderPlacedEmails(order: OrderRecord) {
  const { site } = await getSettings();
  const results = await Promise.allSettled([
    deliver({
      to: order.customer.email,
      subject: `Order received — ${order.reference}`,
      tag: "order-received",
      template: <OrderReceivedEmail order={order} site={site} />,
    }),
    deliver({
      to: site.adminEmail,
      subject: `New order ${order.reference} — ${order.customer.name}`,
      tag: "admin-new-order",
      template: <NewOrderAlertEmail order={order} site={site} />,
    }),
  ]);
  return results.every((r) => r.status === "fulfilled");
}

/** Email 3 — admin sends payment details from the dashboard. */
export async function sendPaymentInstructions(order: OrderRecord) {
  const { site } = await getSettings();
  return deliver({
    to: order.customer.email,
    subject: `Payment details — ${order.reference}`,
    tag: "payment-instructions",
    template: <PaymentInstructionsEmail order={order} site={site} />,
  });
}

/** Email 4 — payment marked as received. */
export async function sendPaymentConfirmed(order: OrderRecord) {
  const { site } = await getSettings();
  return deliver({
    to: order.customer.email,
    subject: `Payment received — ${order.reference}`,
    tag: "payment-confirmed",
    template: <PaymentConfirmedEmail order={order} site={site} />,
  });
}

/** Email 5 — status moved by admin. */
export async function sendStatusUpdate(order: OrderRecord, note?: string) {
  const { site } = await getSettings();
  return deliver({
    to: order.customer.email,
    subject: `Order ${order.reference} — ${order.status}`,
    tag: "status-update",
    template: <StatusUpdateEmail order={order} note={note} site={site} />,
  });
}

/** Email 6 — contact form: admin notice + client auto-reply. */
export async function sendEnquiryEmails(enquiry: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { site } = await getSettings();
  await Promise.allSettled([
    deliver({
      to: site.adminEmail,
      subject: `Enquiry from ${enquiry.name}: ${enquiry.subject}`,
      tag: "admin-enquiry",
      template: <EnquiryNoticeEmail {...enquiry} site={site} />,
    }),
    deliver({
      to: enquiry.email,
      subject: "We received your message — " + site.name,
      tag: "enquiry-auto-reply",
      template: <EnquiryAutoReplyEmail name={enquiry.name} message={enquiry.message} site={site} />,
    }),
  ]);
}

/** Email 7 — admin replies to an enquiry from the dashboard. */
export async function sendEnquiryReply(
  enquiry: { name: string; email: string; subject?: string; message?: string },
  reply: string,
) {
  const { site } = await getSettings();
  return deliver({
    to: enquiry.email,
    subject: `Re: ${enquiry.subject ?? "Your enquiry"} — ${site.name}`,
    tag: "enquiry-reply",
    template: <EnquiryReplyEmail name={enquiry.name} reply={reply} site={site} />,
  });
}

/** Email 8 — admin replies to an order's customer via SMTP. */
export async function sendOrderReply(order: OrderRecord, reply: string) {
  const { site } = await getSettings();
  return deliver({
    to: order.customer.email,
    subject: `Re: Order ${order.reference} — ${site.name}`,
    tag: "order-reply",
    template: <OrderReplyEmail order={order} reply={reply} site={site} />,
  });
}

export type { SiteInfo };