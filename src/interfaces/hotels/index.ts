import { ID } from '../../common/types';
import { Hotel } from '../../schemas/hotel.schema';
import { HotelRoom } from '../../schemas/rooms.schema';

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: ID;
  isEnabled?: boolean;
}

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

export interface SearchRoomDto {
  id: string;
  description: string;
  images: string[];
  hotel: {
    id: string;
    title: string;
    description: string;
  };
}
