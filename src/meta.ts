const meta: any = [
  {
    key: "classes",
    name: "Classes",
    headers: [
      { text: "ID", value: "id", sortable: true },
      { text: "Class type", value: "classType.name", sortable: true },
      { text: "Name", value: "name", sortable: true },
      { text: "Inner class", value: "innerClass", sortable: true },
      { text: "Diagram", value: "diagram.title", sortable: true },
    ],
    dataSource: "/classes/project/",
    children: [
      {
        key: "properties",
        name: "Properties",
        dataSource: "/properties/class/",
      },
      {
        key: "methods",
        name: "Methods",
        dataSource: "/methods/class/",
      },
      {
        key: "relationships",
        name: "Relationships",
        dataSource: "/relationships/class/",
      },
    ],
  },
  {
    key: "properties",
    name: "Properties",
    headers: [
      { text: "ID", value: "id", sortable: true },
      { text: "Access type", value: "accessType.name", sortable: true },
      { text: "Name", value: "name", sortable: true },
      { text: "Type", value: "type", sortable: true },
      { text: "Class", value: "class_.name", sortable: true },
    ],
    dataSource: "/properties/project/",
  },
  {
    key: "methods",
    name: "Methods",
    headers: [
      { text: "ID", value: "id", sortable: true },
      { text: "Access type", value: "accessType.name", sortable: true },
      { text: "Abstract", value: "abstract_", sortable: true },
      { text: "Name", value: "name", sortable: true },
      { text: "Return type", value: "returnType", sortable: true },
      { text: "Class", value: "class_.name", sortable: true },
    ],
    dataSource: "/methods/project/",
    children: [
      {
        key: "parameters",
        name: "Parameters",
        dataSource: "/parameters/method/",
      },
    ],
  },
  {
    key: "relationships",
    name: "Relationships",
    headers: [
      { text: "ID", value: "id", sortable: true },
      { text: "Type", value: "relationshipType.name", sortable: true },
      { text: "Parent class", value: "parentClass.name", sortable: true },
      { text: "Child class", value: "childClass.name", sortable: true },
    ],
    dataSource: "/relationships/project/",
  },
  {
    key: "parameters",
    name: "Parameters",
    headers: [
      { text: "ID", value: "id", sortable: true },
      { text: "Name", value: "name", sortable: true },
      { text: "Type", value: "type", sortable: true },
      { text: "Method", value: "method.name", sortable: true },
    ],
    dataSource: "/parameters/project/",
  },
];

export default meta;
