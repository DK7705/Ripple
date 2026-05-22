import { supabase } from "@/lib/supabase";
import { type OrderEvent } from "@/types/order";

export const dynamic = "force-dynamic";

/**
 * SSE endpoint that streams real-time order changes.
 * Uses Supabase Realtime to listen for INSERT/UPDATE/DELETE on the `orders` table,
 * then forwards each event as an SSE message to the connected client.
 */
export async function GET() {
  const encoder = new TextEncoder();

  // Hoisted for cleanup access from both start() and cancel()
  let channel: ReturnType<typeof supabase.channel> | null = null;
  let keepalive: ReturnType<typeof setInterval> | null = null;

  function cleanup() {
    if (keepalive) { clearInterval(keepalive); keepalive = null; }
    if (channel) { channel.unsubscribe(); channel = null; }
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keepalive
      controller.enqueue(encoder.encode(": connected\n\n"));

      // Set up Supabase realtime subscription
      channel = supabase
        .channel("orders-sse-stream")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          (payload) => {
            const event: OrderEvent = {
              type: payload.eventType as OrderEvent["type"],
              record: (payload.new as OrderEvent["record"]) ?? payload.old as OrderEvent["record"],
              old_record: payload.old as OrderEvent["old_record"],
              timestamp: new Date().toISOString(),
            };

            const data = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;

            try {
              controller.enqueue(encoder.encode(data));
            } catch {
              // Client disconnected — clean up
              cleanup();
            }
          }
        )
        .subscribe();

      // Keepalive ping every 15 seconds to prevent proxy timeouts
      keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          cleanup();
        }
      }, 15_000);
    },
    cancel() {
      // Stream was cancelled by the client — clean up resources
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
