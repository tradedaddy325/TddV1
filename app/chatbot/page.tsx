"use client";

import { TradeDaddyChatbot } from "@/components/TradeDaddyChatbot";

/**
 * Full-page chatbot route
 * This page wraps the TradeDaddyChatbot component in full-page mode
 */
export default function ChatbotPage() {
  return <TradeDaddyChatbot isEmbedded={false} />;
}
