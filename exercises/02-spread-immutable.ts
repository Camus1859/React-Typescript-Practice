type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  { id: 1, name: "Anderson", email: "anderson@test.com" },
  { id: 2, name: "Mary", email: "mary@test.com" },
  { id: 3, name: "Natalie", email: "natalie@test.com" },
];


const updateUser = (users: User[]) => {
  const userCopy = [ ...users ];

  const addUser = [...userCopy, {id: 4, name: "Yi", email: "yi@test.com"}]

  const usersNoId2 = addUser.filter(a=> a.id !== 2)

  const updateUserId1 = usersNoId2.map((u)=> {

    return {
      ...u,
      email: u.id === 1 ?  "newemail@test.com" : u.email
    }
  })


  console.log(updateUserId1);
};

console.log(updateUser(users));
