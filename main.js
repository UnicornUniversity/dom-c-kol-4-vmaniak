/**
 * The main function which calls the application.
 * This function creates a random list of employees and returns statistics.
 * @param {object} dtoIn contains count of employees and age limit of employees {min, max}
 * @returns {object} statistics of employees
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);

  return dtoOut;
}

/**
 * The function creates a random list of employees.
 * @param {object} dtoIn contains count of employees and age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  /**
   * Arrays with values used for random generation.
   */
  const maleNames = [
    "Jan",
    "Josef",
    "Antonin",
    "Karel",
    "Frantisek",
    "Miroslav",
    "Radek",
    "Jaroslav",
    "Petr",
    "Roman",
  ];

  const femaleNames = [
    "Jana",
    "Marie",
    "Jitka",
    "Lucie",
    "Alena",
    "Dana",
    "Iveta",
    "Marcela",
    "Zuzana",
    "Pavla",
  ];

  const maleSurnames = [
    "Novak",
    "Svoboda",
    "Novotny",
    "Dvorak",
    "Cerny",
    "Prochazka",
    "Kucera",
    "Vesely",
    "Horak",
    "Nemec",
    "Marek",
  ];

  const femaleSurnames = [
    "Novakova",
    "Svobodova",
    "Novotna",
    "Dvorakova",
    "Cerna",
    "Prochazkova",
    "Kucerova",
    "Vesela",
    "Horakova",
    "Nemcova",
    "Markova",
  ];

  const workloads = [10, 20, 30, 40];

  const dtoOut = [];

  for (let i = 0; i < dtoIn.count; i++) {
    /**
     * Create one employee and fill in all required values.
     */
    const employee = {};

    employee.gender = getRandomGender();
    employee.birthdate = getRandomBirthdate(dtoIn.age.min, dtoIn.age.max);
    employee.name = getRandomName(employee.gender, maleNames, femaleNames);
    employee.surname = getRandomSurname(employee.gender, maleSurnames, femaleSurnames);
    employee.workload = getRandomWorkload(workloads);

    dtoOut.push(employee);
  }

  return dtoOut;
}

/**
 * The function creates statistics from employee list.
 * @param {Array} employees contains all generated employees
 * @returns {object} statistics of employees
 */
export function getEmployeeStatistics(employees) {
  const dtoOut = {};
  const workloadCounts = {
    10: 0,
    20: 0,
    30: 0,
    40: 0,
  };
  const ages = employees.map((employee) => getEmployeeAge(employee.birthdate));
  const workloads = employees.map((employee) => employee.workload);
  const women = employees.filter((employee) => employee.gender === "female");
  const womenWorkloads = women.map((employee) => employee.workload);

  employees.forEach((employee) => {
    workloadCounts[employee.workload]++;
  });

  dtoOut.total = employees.length;
  dtoOut.workload10 = workloadCounts[10];
  dtoOut.workload20 = workloadCounts[20];
  dtoOut.workload30 = workloadCounts[30];
  dtoOut.workload40 = workloadCounts[40];
  dtoOut.averageAge = +getAverage(ages).toFixed(1);
  dtoOut.minAge = Math.trunc(Math.min(...ages));
  dtoOut.maxAge = Math.trunc(Math.max(...ages));
  dtoOut.medianAge = Math.trunc(getMedian(ages));
  dtoOut.medianWorkload = getMedian(workloads);
  dtoOut.averageWomenWorkload = womenWorkloads.length === 0 ? 0 : +getAverage(womenWorkloads).toFixed(1);
  dtoOut.sortedByWorkload = Array.from(employees).sort((a, b) => a.workload - b.workload);

  return dtoOut;
}

/**
 * Returns male or female.
 * @returns {string} random gender, male or female
 */
function getRandomGender() {
  const randomNumber = Math.floor(Math.random() * 2);

  if (randomNumber === 0) {
    return "male";
  }

  return "female";
}

/**
 * Returns a random name based on gender.
 * @param {string} gender selected gender
 * @param {Array} maleNames list of male names
 * @param {Array} femaleNames list of female names
 * @returns {string} random name
 */
function getRandomName(gender, maleNames, femaleNames) {
  if (gender === "male") {
    return maleNames[Math.floor(Math.random() * maleNames.length)];
  }

  return femaleNames[Math.floor(Math.random() * femaleNames.length)];
}

/**
 * Returns a random surname based on gender.
 * @param {string} gender selected gender
 * @param {Array} maleSurnames list of male surnames
 * @param {Array} femaleSurnames list of female surnames
 * @returns {string} random surname
 */
function getRandomSurname(gender, maleSurnames, femaleSurnames) {
  if (gender === "male") {
    return maleSurnames[Math.floor(Math.random() * maleSurnames.length)];
  }

  return femaleSurnames[Math.floor(Math.random() * femaleSurnames.length)];
}

/**
 * Returns a random workload.
 * @param {Array} workloads list of possible workloads
 * @returns {number} random workload
 */
function getRandomWorkload(workloads) {
  return workloads[Math.floor(Math.random() * workloads.length)];
}

/**
 * Returns a random birthdate from the selected age range.
 * @param {number} minAge minimum age of employee
 * @param {number} maxAge maximum age of employee
 * @returns {string} random birthdate in ISO format
 */
function getRandomBirthdate(minAge, maxAge) {
  const today = new Date();

  /**
   * Oldest possible employee date.
   */
  const oldestDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate(),
  );

  /**
   * Youngest possible employee date.
   */
  const youngestDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate(),
  );

  const randomTime =
    oldestDate.getTime() + Math.random() * (youngestDate.getTime() - oldestDate.getTime());

  const randomDate = new Date(randomTime);

  return randomDate.toISOString();
}

/**
 * Returns employee age as decimal number.
 * @param {string} birthdate employee birthdate in ISO format
 * @returns {number} employee age
 */
function getEmployeeAge(birthdate) {
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return (new Date() - new Date(birthdate)) / millisecondsInYear;
}

/**
 * Returns median from numbers.
 * @param {Array} numbers list of numbers
 * @returns {number} median value
 */
function getMedian(numbers) {
  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);

  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  }

  return sortedNumbers[middleIndex];
}

/**
 * Returns average value.
 * @param {Array} numbers list of numbers
 * @returns {number} average value
 */
function getAverage(numbers) {
  const sum = numbers.reduce((total, number) => total + number, 0);

  return sum / numbers.length;
}
