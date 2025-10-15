export interface Booking{
  id?: number;
  propertyId: number;
  checkInDate: Date;
  checkOutDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingDate?: Date;
  status?: string;
}

export interface BookedDate{
  bookedDate: Date;
  isBooked: boolean;
}
