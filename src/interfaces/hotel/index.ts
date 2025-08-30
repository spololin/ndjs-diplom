import { Hotel } from '../../schemas/hotel.schema';
import { HotelRoom } from '../../schemas/hotelRoom.schema';
import { Id } from '../common';

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
  findById(id: Id): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: Id, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: Id;
  isEnabled?: boolean;
}

export interface IHotelRoomService {
  create(data: CreateRoomParams): Promise<HotelRoom>;
  findById(id: Id): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: Id, data: UpdateRoomParams): Promise<HotelRoom>;
}

export interface CreateRoomParams {
  hotelId: Id;
  title: string;
  description: string;
  images: string[];
}

export interface UpdateRoomParams {
  hotelId: Id;
  isEnabled: boolean;
  description: string;
  images: string[];
}
