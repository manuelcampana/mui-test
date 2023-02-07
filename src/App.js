import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Container } from "@mui/material";
import axios from "axios";

const rows = [
  {
    id: 1,
    col1: "Hello",
    col2: "World",
    first_name: "Testy McTestisson",
    last_name: "Test",
    email: "testy_mctestisson@test.test",
    tags: "aaa,bbb,ccc",
  },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

export default function App() {
  const [constituents, setConstituents] = React.useState([]);
  const [additional_columns, setAdditionalColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const default_columns = [
    {
      field: "first_name",
      headerName: "First Name",
      minWidth: 150,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      minWidth: 150,
    },
    { field: "email", headerName: "Email", minWidth: 150 },
    { field: "tags", headerName: "Tags", minWidth: 150 },
  ];

  const columns = [...default_columns, ...additional_columns];

  const formatColums = (cols) => {
    return cols.map((col) => {
      return { field: col.name, headerName: col.label };
    });
  };

  const dataFetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    setTimeout(() => {
      console.log("Fetching data...");
      console.time("Rensponse Time");
      axios
        .get("https://staging-api.hubbub.net/v1/constituent")
        .then((res) => {
          console.log("FETCHED:", res.data);
          setConstituents([...rows, ...res.data]);
          setAdditionalColumns(formatColums(res.data.meta.additional_columns));
        })
        .catch((err) => {
          console.log("ERROR:", err);
        })
        .finally(() => {
          console.timeEnd("Rensponse Time");
          setLoading(false);
        });
    }, 5000);
  }, []);

  return (
    <Container fixed>
      <Card style={{ marginTop: 50, height: "calc(100vh - 100px)" }}>
        <DataGrid
          disableColumnResize={false}
          rows={constituents}
          columns={columns}
          loading={loading}
        />
      </Card>
    </Container>
  );
}
