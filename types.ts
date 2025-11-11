export interface Landmark {
  name: string;
  description: string;
  imageUrl: string;
}

export interface BookingDetails {
  [key: string]: any; 
  travelers?: number;
  budget?: string;
  hotelStars?: number;
  travelDates?: string;
}

export interface EmailDetails {
  recipient: string;
  subject: string;
  body: string;
}
