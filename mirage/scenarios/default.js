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

  const rexToy1 = server.create("toy", {
    name: "Toy1",
  });
  const rexToy2 = server.create("toy", {
    name: "Toy2",
  });
  const totoToy1 = server.create("toy", {
    name: "Toy3",
  });

  const rex = server.create("pet", {
    name: "Rex",
    age: 5,
    shape: normal,
    toys: [rexToy1, rexToy2],
  });
  const toto = server.create("pet", {
    name: "Toto",
    age: 10,
    shape: overweight,
    toys: [totoToy1],
  });

  server.create("person", {
    id: "1",
    name: "Tom",
    pets: [rex, toto],
  });
}
