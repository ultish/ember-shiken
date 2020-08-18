export default function () {
  this.get("/people");
  this.get("/people/:id");
  this.get("/pets");
  this.get("/pets/:id");
  this.get("/bodyshapes");

  this.patch("/pets/:id");
  this.post("/pets");
  this.delete("/pets/:id");

  this.get("/toys/:id");
  this.get("/toys");
  this.post("/toys");
  this.patch("/toys/:id");
  this.delete("/toys/:id");
}
