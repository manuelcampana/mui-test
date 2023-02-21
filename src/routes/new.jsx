import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, Container } from "@mui/material";
import axios from "axios";

const { REACT_APP_JWT, REACT_APP_CONSTITUENTS_API_URL } = process.env;
axios.defaults.headers.common["Authorization"] = `Bearer ${REACT_APP_JWT}`;

// const rows = [
//   {
//     id: 1,
//     col1: "Hello",
//     col2: "World",
//     first_name: "Testy McTestisson",
//     last_name: "Test",
//     email: "testy_mctestisson@test.test",
//     tags: "aaa,bbb,ccc",
//   },
//   { id: 2, col1: "DataGridPro", col2: "is Awesome" },
//   { id: 3, col1: "MUI", col2: "is Amazing" },
// ];

export default function New() {
  const [constituents, setConstituents] = React.useState([]);
  const [additional_columns, setAdditionalColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);

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

  // THINGS SHOULD BE SLIGHTLY FASTER WHEN WE GET THE DATA IN THE RIGHT FORMAT FROM THE API
  // AND WE DON'T HAVE TO DO THIS
  const formatColums = (cols) => {
    return cols.map((col) => {
      return { field: col.name, headerName: col.label };
    });
  };

  const dataFetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    console.log("Fetching data...");
    console.time("Rensponse Time");
    axios
      .get(REACT_APP_CONSTITUENTS_API_URL, {
        params: {
          page: 1,
          page_size: 10000,
        },
      })
      .then((res) => {
        console.log("FETCHED:", res.data);
        setConstituents([...res.data.constituents]);
        // setRowCount(res.data.pagination.total_items);
        setRowCount(res.data.constituents.length);
        setAdditionalColumns(formatColums(res.data.meta.additional_columns));
      })
      .catch((err) => {
        console.log("ERROR:", err);
      })
      .finally(() => {
        console.timeEnd("Rensponse Time");
        setLoading(false);
        dataFetchedRef.current = false;
      });
  }, []);

  return (
    <Container fixed>
      <Card style={{ marginTop: 50, height: "calc(100vh - 150px)" }}>
        <DataGrid
          disableColumnResize={false}
          rows={constituents}
          getRowId={(row) => row.email}
          columns={columns}
          loading={loading}
          pagination
          rowCount={rowCount}
          page={page}
          rowsPerPageOptions={[100, 1000, 10000]}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          // hideFooterPagination
          checkboxSelection
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Card>
    </Container>
  );
}
