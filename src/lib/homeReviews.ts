import type { Review } from '@/types/product';

export const homeReviews: Review[] = [
  {
    id: "home-review-1",
    author: "Sarah Johnson",
    avatar: "https://i.ibb.co/4w8W5qG8/icon-7797704-640.png",
    rating: 5,
    date: "2025-01-15",
    title: "Excellent camera for the price!",
    content: "This G7X Mark III is in amazing condition despite being used. The image quality is fantastic and it's perfect for travel photography. The compact size makes it so convenient to carry around. Very happy with this purchase!",
    helpful: 12,
    verified: true,
    location: "New York, NY",
    purchaseDate: "January 2025",
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop&auto=format&q=80"
    ]
  },
  {
    id: "home-review-2",
    author: "David Thompson",
    avatar: "https://i.ibb.co/ZzZm6PT2/avatars-000652081152-ddbg70-t500x500.jpg",
    rating: 5,
    date: "2025-02-10",
    title: "Best drone I've ever flown",
    content: "The DJI Mavic 2 Pro is absolutely incredible. The camera quality is stunning and the flight controls are super smooth. Obstacle avoidance works flawlessly and battery life is impressive. Worth every penny for aerial photography!",
    helpful: 18,
    verified: true,
    location: "Seattle, WA",
    purchaseDate: "February 2025",
    images: [
      "https://i.ibb.co/vCq3Gd7h/s-l1600-18.webp",
      "https://i.ibb.co/pvtFkydF/s-l1600-19.webp"
    ]
  },
  {
    id: "home-review-3",
    author: "Jessica M.",
    avatar: "https://i.ibb.co/4w8W5qG8/icon-7797704-640.png",
    rating: 5,
    date: "2025-03-22",
    title: "Game changer for summer parties!",
    content: "I bought the Ninja SLUSHi for my daughter's birthday party and it was a total hit. We made blue raspberry slushies and frozen lemonade all afternoon. The 72oz pitcher is huge—enough for a dozen kids at once. I love that the parts are dishwasher safe because cleanup was a breeze after a sticky day.",
    helpful: 24,
    verified: true,
    location: "Austin, TX",
    purchaseDate: "March 2025",
    images: [
      "https://i.ibb.co/PZLLSbFW/s-l1600-21.webp",
      "https://i.ibb.co/twZpCnsP/s-l1600-20.webp"
    ]
  },
  {
    id: "home-review-4",
    author: "Ashley Johnson",
    avatar: "https://i.ibb.co/whhmMqhv/2219349473-huge.jpg",
    rating: 5,
    date: "2025-04-18",
    title: "Sleep tracking is actually fun now",
    content: "I was skeptical about wearing a ring to bed, but the Oura Ring is so light I forget it's on. The sleep insights are wild—turns out my '8 hours' was more like 6.5 of real sleep. The gold finish is gorgeous and matches my other jewelry. Battery lasts me 5 days, and the charger is super compact.",
    helpful: 19,
    verified: true,
    location: "Portland, OR",
    purchaseDate: "April 2025",
    images: [
      "https://i.ibb.co/RGYHKDMg/s-l1600-22.webp",
      "https://i.ibb.co/WW8DJ95q/s-l1600-23.webp"
    ]
  },
  {
    id: "home-review-5",
    author: "Mike Chen",
    avatar: "https://i.ibb.co/4w8W5qG8/icon-7797704-640.png",
    rating: 4,
    date: "2025-05-05",
    title: "Great camera, minor cosmetic issues",
    content: "The camera works perfectly as described. There are some minor scratches on the screen and body, but nothing that affects performance. The image quality is excellent and the 256GB memory card is a nice bonus. Would recommend for anyone looking for a quality compact camera.",
    helpful: 8,
    verified: true,
    location: "Los Angeles, CA",
    purchaseDate: "May 2025",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&auto=format&q=80"
    ]
  }
];

export const homeReviewsStats = {
  averageRating: 4.8,
  totalReviews: 156
}; 