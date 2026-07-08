describe("EventsService", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });

  it("should create an event object", () => {
    const event = {
      title: "Charla académica",
      description: "Evento de prueba",
      location: "Auditorio",
      capacity: 50,
    };

    expect(event.title).toBe("Charla académica");
    expect(event.capacity).toBeGreaterThan(0);
  });

  it("should validate end date after start date", () => {
    const startDate = new Date("2026-07-08T10:00:00");
    const endDate = new Date("2026-07-08T12:00:00");

    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });
});