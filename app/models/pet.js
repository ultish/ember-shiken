import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr("string"),
  age: DS.attr("number"),
  shape: DS.belongsTo("bodyshape"),
  owner: DS.belongsTo("person"),
});
