import { render } from "@react-email/render";
import { sendEmail, toText } from "./mailer";
import type { OrderRecord } from "./orders";
import { SITE } from "./constants";
import {
  EnquiryAutoReplyEmail,
  EnquiryNoticeEmail,
  NewOrderAlertEmail,
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
  const results = await Promise.allSettled([
    deliver({
      to: order.customer.email,
      subject: `Order received — ${order.reference}`,
      tag: "order-received",
      template: <OrderReceivedEmail order={order} />,
    }),
    deliver({
      to: SITE.adminEmail,
      subject: `New order ${order.reference} — ${order.customer.name}`,
      tag: "admin-new-order",
      template: <NewOrderAlertEmail order={order} />,
    }),
  ]);
  return results.every((r) => r.status === "fulfilled");
}

/** Email 3 — admin sends payment details from the dashboard. */
export async function sendPaymentInstructions(order: OrderRecord) {
  return deliver({
    to: order.customer.email,
    subject: `Payment details — ${order.reference}`,
    tag: "payment-instructions",
    template: <PaymentInstructionsEmail order={order} />,
  });
}

/** Email 4 — payment marked as received. */
export async function sendPaymentConfirmed(order: OrderRecord) {
  return deliver({
    to: order.customer.email,
    subject: `Payment received — ${order.reference}`,
    tag: "payment-confirmed",
    template: <PaymentConfirmedEmail order={order} />,
  });
}

/** Email 5 — status moved by admin. */
export async function sendStatusUpdate(order: OrderRecord, note?: string) {
  return deliver({
    to: order.customer.email,
    subject: `Order ${order.reference} — ${order.status}`,
    tag: "status-update",
    template: <StatusUpdateEmail order={order} note={note} />,
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
  await Promise.allSettled([
    deliver({
      to: SITE.adminEmail,
      subject: `Enquiry from ${enquiry.name}: ${enquiry.subject}`,
      tag: "admin-enquiry",
      template: <EnquiryNoticeEmail {...enquiry} />,
    }),
    deliver({
      to: enquiry.email,
      subject: "We received your message — Tony Used Campers",
      tag: "enquiry-auto-reply",
      template: <EnquiryAutoReplyEmail name={enquiry.name} message={enquiry.message} />,
    }),
  ]);
}
