export class QrAccessLog {
  constructor(
    public readonly id: string,
    public readonly qrAccessCodeId: string | null,
    public readonly userId: string | null,
    public readonly qrCode: string,
    public readonly status: string,
    public readonly location: string | null,
    public readonly message: string,
    public readonly attemptDate: Date,
  ) {}
}
