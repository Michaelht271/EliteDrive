export class Vehicle {
  constructor({
    carId,
    carName,
    brand,
    model,
    year,
    licensePlate,
    color,
    seats,
    fuelType,
    transmission,
    carStatus,
    pricePerDay,
    description,
    thumbnailUrl,
    createdAt,
    updatedAt,
  }) {
    this.id = carId;
    this.name = carName;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.licensePlate = licensePlate;
    this.color = color;
    this.seats = seats;
    this.fuelType = fuelType;
    this.transmission = transmission;
    this.status = carStatus;
    this.pricePerDay = pricePerDay;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
