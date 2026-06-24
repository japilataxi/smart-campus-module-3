import {
  SpaceAvailabilityStatus,
  SpaceStatus,
  SpaceType,
} from './space-status.enum';

export class Space {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: SpaceType,
    public readonly location: string,
    public readonly capacity: number,
    public readonly status: SpaceStatus,
    public readonly availabilityStatus: SpaceAvailabilityStatus,
    public readonly openingTime: string,
    public readonly closingTime: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCurrentlyAvailable(currentTime = new Date()): boolean {
    if (this.status !== SpaceStatus.Active) return false;
    if (this.availabilityStatus !== SpaceAvailabilityStatus.Available) return false;

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (
      currentMinutes >= Space.timeToMinutes(this.openingTime) &&
      currentMinutes <= Space.timeToMinutes(this.closingTime)
    );
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
