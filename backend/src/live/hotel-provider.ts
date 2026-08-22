import {GameHotel} from './game-hotel';

export class HotelProvider {
  private static instance: GameHotel;

  static registerHotel(hotel: GameHotel): void {
    if (HotelProvider.instance) {
      throw new Error('An hotel is already registered');
    }
    HotelProvider.instance = hotel;
  }

  static getInstance(): GameHotel {
    if (!HotelProvider.instance) {
      throw new Error('No hotel has been registered');
    }
    return HotelProvider.instance;
  }
}
