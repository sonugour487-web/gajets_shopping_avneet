export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export function getProductReviews(productName: string): Review[] {
  const n = productName.toLowerCase();
  if (n.includes("iphone") || n.includes("i phone"))
    return [
      {
        id: 1,
        name: "Rahul S.",
        rating: 5,
        comment:
          "Amazing phone! Super fast and the camera is incredible. Worth every rupee!",
        date: "Jan 2026",
      },
      {
        id: 2,
        name: "Priya M.",
        rating: 4,
        comment:
          "Great deal at this price. Battery life is excellent. Minor heating issue but overall fantastic.",
        date: "Feb 2026",
      },
      {
        id: 3,
        name: "Arjun K.",
        rating: 5,
        comment: "Best smartphone I have ever used. The display is stunning!",
        date: "Mar 2026",
      },
    ];
  if (n.includes("samsung") || n.includes("galaxy"))
    return [
      {
        id: 1,
        name: "Sneha R.",
        rating: 5,
        comment: "S-Pen is a game changer. The camera zoom is unreal!",
        date: "Jan 2026",
      },
      {
        id: 2,
        name: "Vikram P.",
        rating: 4,
        comment:
          "Excellent phone. Very smooth performance. A bit heavy but worth it.",
        date: "Feb 2026",
      },
      {
        id: 3,
        name: "Anita J.",
        rating: 5,
        comment: "Love the display. Night photography is top notch.",
        date: "Mar 2026",
      },
    ];
  if (n.includes("macbook") || n.includes("laptop"))
    return [
      {
        id: 1,
        name: "Dev T.",
        rating: 5,
        comment:
          "Lightning fast! The M2 chip handles everything with ease. Best laptop ever.",
        date: "Jan 2026",
      },
      {
        id: 2,
        name: "Kavya N.",
        rating: 4,
        comment:
          "Great build quality and battery life. A little pricey but worth it.",
        date: "Feb 2026",
      },
    ];
  if (n.includes("redmi") || n.includes("note"))
    return [
      {
        id: 1,
        name: "Pooja L.",
        rating: 5,
        comment: "Incredible 200MP camera for this price. Super crisp photos!",
        date: "Feb 2026",
      },
      {
        id: 2,
        name: "Amit V.",
        rating: 4,
        comment: "5G performance is blazing fast. Great battery life too.",
        date: "Mar 2026",
      },
      {
        id: 3,
        name: "Riya S.",
        rating: 5,
        comment: "Best budget phone available. Outstanding display quality.",
        date: "Jan 2026",
      },
    ];
  return [
    {
      id: 1,
      name: "Rohit G.",
      rating: 4,
      comment: "Good product. Fast delivery. Exactly as described.",
      date: "Feb 2026",
    },
    {
      id: 2,
      name: "Meena D.",
      rating: 5,
      comment: "Superb quality at this price. Highly recommended!",
      date: "Mar 2026",
    },
    {
      id: 3,
      name: "Suresh B.",
      rating: 4,
      comment: "Happy with this purchase. Good value for money.",
      date: "Jan 2026",
    },
  ];
}
