import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Card, Container } from "@mui/material";
import axios from "axios";

const constituentsApiUrl = "https://us-staging-api.hubbub.net/v1/constituent";
const JWT =
  "eyJraWQiOiJrT3kxcmloT0dFMEliRlloeWV1WFI2WnlzS1RJNEFUZDVjY3ZscnV6VXFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDRlMjE1OC1jZmZhLTQyYmItOWIxYy04YmI1M2E5ZGJiMGMiLCJldmVudF9pZCI6IjM4YjUzZTZiLTBhM2QtNGQ0Ni04ZWU2LTdiYjM4ZmMyZjdlNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzU3ODgyNTQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0JOMFRKaEJjVCIsImV4cCI6MTY3NTc5MTg1NCwiaWF0IjoxNjc1Nzg4MjU0LCJqdGkiOiJkZDVkMTdkNy0wNmVjLTQwNDMtOGQzOS00ZjAyYjQwMDUwZjgiLCJjbGllbnRfaWQiOiIyMnZ1NGU1bXBwczlnMG8yY3UxMWduZnYxMiIsInVzZXJuYW1lIjoiN2Q0ZTIxNTgtY2ZmYS00MmJiLTliMWMtOGJiNTNhOWRiYjBjIn0.RZQSu-fKngLDMq_rC2AjosdsNLR_sxzxQOfhE2QKFLeMmgjps5cVypcq_e1hVBK1QYxvbqNGs2dkLBL5Z78e7EtLlY1TOD4dHCJUJR74FIbGqh-UBODMCRcvevQptn8iogvI857B1lT7TSY_eusIdzE5KIDR6Yzqc2T0IivkVk8qXy9eF-Poup3hOK7foMZ0Aue4faXwsALy3PgHGHn2c8jzbniN9INkX3FioJVZnzuIFPmB3HrDIIBjEGe2-kdvcz5FcU-Qzc-eGuSo65VTpKZyYxlLtFRyFig5lQDsDlZlKZk0xUqnHopKHX8jTX0tZPT9gbW4IOBy4J6tY_KW6w";
axios.defaults.headers.common["Authorization"] = `Bearer ${JWT}`;

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
      .get(constituentsApiUrl, {
        params: {
          page: page,
          page_size: 10000, // FIXME: this should be pageSize
        },
      })
      .then((res) => {
        console.log("FETCHED:", res.data);
        setConstituents([...res.data.constituents]);
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
  }, [page, pageSize]);

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
          rowCount={1000}
          // page={page}
          // rowsPerPageOptions={[100, 500, 1000]}
          // pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          hideFooterPagination
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
