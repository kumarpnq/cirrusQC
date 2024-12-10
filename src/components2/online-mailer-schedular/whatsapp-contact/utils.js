export const getSlots = (row, selectedUser, selectedSlots) => {
  let rowForStates = row?.whatsappConfig?.find(
    (i) => i.userId === selectedUser
  );
  let activeSlots =
    rowForStates?.slots?.filter((i) => i.isActive === "Y").map((i) => i.time) ||
    [];

  const testSlots = [
    ...selectedSlots
      .filter((slot) => !activeSlots.includes(slot))
      .map((slot) => ({
        time: slot,
        isActive: "Y",
      })),

    ...activeSlots
      .filter((slot) => !selectedSlots.includes(slot))
      .map((slot) => ({
        time: slot,
        isActive: "N",
      })),
  ];

  return testSlots;
};

export const getCompanies = (row, selectedUser, selectedCompanies) => {
  let rowForStates = row?.whatsappConfig?.find(
    (i) => i.userId === selectedUser
  );
  let activeSlots =
    rowForStates?.companyIds
      ?.filter((i) => i.isActive === "Y")
      .map((i) => i.companyId) || [];

  const testCompanies = [
    ...selectedCompanies
      .filter((slot) => !activeSlots.includes(slot))
      .map((slot) => ({
        time: slot,
        isActive: "Y",
      })),

    ...activeSlots
      .filter((slot) => !selectedCompanies.includes(slot))
      .map((company) => ({
        companyId: company,
        isActive: "N",
      })),
  ];

  return testCompanies;
};

export const getContacts = (row, selectedUser, selectedContacts) => {
  let rowForStates = row?.whatsappConfig?.find(
    (i) => i.userId === selectedUser
  );
  let activeContacts = rowForStates?.contacts
    ?.filter((i) => i.isActive === "Y")
    .map((i) => String(i.contactNumber));

  const testContacts = [
    ...selectedContacts
      .filter((contact) => !activeContacts.includes(contact))
      .map((contact) => ({
        contactNumber: contact,
        isActive: "Y",
      })),

    ...activeContacts
      .filter((contact) => !selectedContacts.includes(contact))
      .map((contact) => ({
        contactNumber: contact,
        isActive: "N",
      })),
  ];

  return testContacts;
};
