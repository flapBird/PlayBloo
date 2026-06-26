import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About Us - ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, the free online games platform.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-black mb-6">About {SITE_NAME}</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          {SITE_NAME} is a free online gaming platform that brings you the latest and best browser games.
          We carefully curate our collection to ensure you have access to high-quality games across
          every genre imaginable.
        </p>
        <p>
          Our mission is simple: to create a browser-gaming platform that works seamlessly for users
          around the world. We believe great games should be accessible to everyone, without downloads,
          intrusive ads, or complicated setups.
        </p>
        <p>
          Whether you are into action, puzzle, driving, strategy, or casual games, {SITE_NAME} has
          something for you. We add new games regularly to keep the experience fresh and exciting.
        </p>
      </div>
    </div>
  );
}
