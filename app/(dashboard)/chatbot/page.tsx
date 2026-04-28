import TradeDaddyChatbot from "@/components/TradeDaddyChatbot"

export const metadata = {
  title: "TradeDaddy AI — Terminal",
}

export default function ChatbotPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      <TradeDaddyChatbot />
    </div>
  )
}
