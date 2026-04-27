/**
 * Dev-only dummy data generators using @faker-js/faker.
 * Dynamically imports faker so it's tree-shaken from production builds.
 */

export async function generateVehicleRegistrationFields() {
  const { faker } = await import("@faker-js/faker");

  const plateCode = faker.helpers.arrayElement(["AA", "OR", "AM", "TG", "SN"]);
  const plateNum = faker.number.int({ min: 10000, max: 99999 });
  const trailerNum = faker.number.int({ min: 10000, max: 99999 });

  return {
    transporter: {
      tradeName: `${faker.person.lastName()} Transport ${faker.helpers.arrayElement(["PLC", "LLC", "Trading"])}`,
      phoneNumber: `09${faker.string.numeric(8)}`,
      address: `${faker.location.city()}, ${faker.location.street()}, House ${faker.number.int({ min: 1, max: 999 })}`,
    },
    driver: {
      firstName: faker.person.firstName("male"),
      middleName: faker.person.firstName("male"),
      lastName: faker.person.lastName(),
      phoneNumber: `09${faker.string.numeric(8)}`,
      driverLicenceNumber: `DL-ETH-${faker.date.recent().getFullYear()}-${faker.string.numeric(5)}`,
    },
    vehicle: {
      plateNumber: `${plateCode} ${faker.number.int({ min: 1, max: 5 })}-${plateNum}`,
      trailerPlate: `TR ${faker.number.int({ min: 1, max: 3 })}-${trailerNum}`,
      vehicleType: "",
    },
    insurance: {
      insurer: "",
      prePaymentDate: "",
      prePaymentMatureDate: "",
      JV: `JV-${faker.date.recent().getFullYear()}-${faker.string.numeric(3)}`,
      CPV: `CPV-${faker.date.recent().getFullYear()}-${faker.string.numeric(3)}`,
      withHoldTax: String(faker.number.int({ min: 100, max: 1000 })),
      total: String(faker.number.int({ min: 5000, max: 50000 })),
    },
  };
}
