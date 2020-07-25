export default function (server) {
  server.create("bodyshape", {
    name: "Slim",
  });
  const overweight = server.create("bodyshape", {
    name: "Overweight",
  });
  const normal = server.create("bodyshape", {
    name: "Normal",
  });

  const rex = server.create("pet", {
    name: "Rex",
    age: 5,
    shape: normal,
  });
  const toto = server.create("pet", {
    name: "Toto",
    age: 10,
    shape: overweight,
  });

  server.create("person", {
    id: "1",
    name: "Tom",
    pets: [rex, toto],
  });
}
