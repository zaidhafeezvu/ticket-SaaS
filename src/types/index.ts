export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  price: number;
  eventDate: Date;
  location: string;
  category: string;
  quantity: number;
  available: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
  seller?: {
    name: string | null;
    email: string;
  };
  purchases?: Purchase[];
}

export interface Purchase {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  buyerId: string;
  ticketId: string;
  buyer?: {
    name: string | null;
    email: string;
  };
  ticket?: Ticket;
}
