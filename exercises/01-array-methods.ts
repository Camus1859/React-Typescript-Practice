const people = [
  { name: "Anderson", age: 28 },
  { name: "Mary", age: 35 },
  { name: "Natalie", age: 24 },
  { name: "Yi", age: 31 },
  { name: "Steven", age: 22 },
];

type PeopleType = {
  name: string;
  age: number;
};

// Write a function called analyzePeople that takes in the array above
// and returns an object with these four properties:
//
//   names:       an array of just the name strings
//   olderThan25: an array of people age 25 or older
//   yi:          the person named "Yi"
//   totalAge:    the sum of all ages
//
// Type the input parameter, the return type, and everything in between.
// Then call it and console.log the result.

const analyzePeople = (
  people: PeopleType[],
): {
  names: string[];
  olderThan25: PeopleType[];
  yi: PeopleType | undefined;
  totalAge: number;
} => {
  const names = people.map((p) => p.name);
  const olderThan25 = people.filter((p) => p.age >= 25);
  const yi = people.find((p) => p.name === "Yi");
  const totalAge = people.reduce((acc, val) => acc + val.age, 0);

  return { names, olderThan25, yi, totalAge };
};

console.log(analyzePeople(people));
