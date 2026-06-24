export class QrAccessCode {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly qrCode: string,
    public readonly accessType: string,
    public readonly location: string,
    public readonly status: string,
    public readonly expirationDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
