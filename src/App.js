import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Container } from "@mui/material";
import axios from "axios";

const constituentsApiUrl = "https://us-staging-api.hubbub.net/v1/constituent";
const JWT =
  "eyJraWQiOiJrT3kxcmloT0dFMEliRlloeWV1WFI2WnlzS1RJNEFUZDVjY3ZscnV6VXFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDRlMjE1OC1jZmZhLTQyYmItOWIxYy04YmI1M2E5ZGJiMGMiLCJldmVudF9pZCI6ImJmYzM2OThiLWQ1NDgtNDczMS05YTU1LTg1YWRhMTQzMWViOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzU3ODIzMTUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0JOMFRKaEJjVCIsImV4cCI6MTY3NTc4NTkxNSwiaWF0IjoxNjc1NzgyMzE1LCJqdGkiOiI1MzkwZmE3Ny1hM2YzLTQ0ODYtOGQ3Zi0zMDA4ZmVkMWNhMWYiLCJjbGllbnRfaWQiOiIyMnZ1NGU1bXBwczlnMG8yY3UxMWduZnYxMiIsInVzZXJuYW1lIjoiN2Q0ZTIxNTgtY2ZmYS00MmJiLTliMWMtOGJiNTNhOWRiYjBjIn0.stftqhXMVYxAum7xwjKjsfVABgunJZPBXUpQIgopC-oKHB30WMbFg9QbNZwzdWySHtguHn6oD7HvuBSaPfSdlA3i4clpeHJv4WqIP1RNiKFIp75tSxrIimkJGN5kTTbbAHZ6rxlM3F3Z7dY1lBBCcKziIFd2-igd5UwUo30PF1Xogn7UvxYCUe7GDsluFVFSNyCCgvfFhD4hgJ9-9GyttQAmJd2qAVDvut3-P7iuk2ybkjFntJdFguqrLgSmdHvs2J4fva3Y0cNBiD7KArgBRio20QWstLVzhBT3vPbIvk4F-9f8CQgYBQBA0jouPodHK7FCQxzd1LPvTvy-FZc1qw";
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

export default function App() {
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
      });
  }, [page, pageSize]);

  return (
    <Container fixed>
      <Card style={{ marginTop: 50, height: "calc(100vh - 1000px)" }}>
        <DataGrid
          disableColumnResize={false}
          rows={constituents}
          getRowId={(row) => row.email}
          columns={columns}
          loading={loading}
          // pagination
          // page={page}
          // rowsPerPageOptions={[100, 500, 1000]}
          // pageSize={pageSize}
          paginationMode="server"
          // onPageChange={(newPage) => setPage(newPage)}
          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          hideFooter
        />
      </Card>
    </Container>
  );
}
