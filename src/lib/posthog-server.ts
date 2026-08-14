import 'server-only'
import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function getPostHogServer() {
  if (!client) {
    client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Serverless functions can be frozen/torn down right after the response
      // is sent, before a batched flush would fire — send every event immediately.
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}
