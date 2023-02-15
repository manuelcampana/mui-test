import * as React from "react";
import { Card, Container } from "@mui/material";
import MUIDataTable from "mui-datatables";
import axios from "axios";

const constituentsApiUrl = "https://us-staging-api.hubbub.net/v1/constituent";
const JWT =
  "eyJraWQiOiJrT3kxcmloT0dFMEliRlloeWV1WFI2WnlzS1RJNEFUZDVjY3ZscnV6VXFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDRlMjE1OC1jZmZhLTQyYmItOWIxYy04YmI1M2E5ZGJiMGMiLCJldmVudF9pZCI6IjhmMDIyNjVmLWVlODYtNDg1Yi05NjBiLTI1ZjQ0ODU2ZGExMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzY0NzAyMTksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0JOMFRKaEJjVCIsImV4cCI6MTY3NjQ3MzgxOSwiaWF0IjoxNjc2NDcwMjE5LCJqdGkiOiIwYTc2ODA1ZC03NzQ0LTQ5YTItOGE5ZC1hMjM1ZDg0MTEwNGMiLCJjbGllbnRfaWQiOiIyMnZ1NGU1bXBwczlnMG8yY3UxMWduZnYxMiIsInVzZXJuYW1lIjoiN2Q0ZTIxNTgtY2ZmYS00MmJiLTliMWMtOGJiNTNhOWRiYjBjIn0.yZuU_LrbBgMsZQpUCADQp60LkHF7aIGk6LeUU6-phS1X94wdpeGY-V04P8B_L8ud1rNLzLSTiqKXDJutk0uba4fC1aExtoXtWy8YaIjt0rKZsTixznkEFswSpSd5a5bIFNKetBwrolVEV7dxN0uWNjI5vq4t-lOKaeI7ayyLwInE04fmPrQztLAswB3ClkGA2eEfjTtE5n5xMFoBYotKzBQ5rSlo9pzd-j9XS4N9sXbqrHF-nbqRU3c8rPoX0T3MnqJSExtda0VRmDdTB7MsfPJj9QqlEWFFGmSzaOtTReOnT1qg3Er24-Cwa8pYqIlLIbsLBD-fpk-LbhTeOZoC3A";
axios.defaults.headers.common["Authorization"] = `Bearer ${JWT}`;

export default function Old() {
  const [constituents, setConstituents] = React.useState([]);
  const [additional_columns, setAdditionalColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    {
      name: "first_name",
      label: "First name",
    },
    {
      name: "last_name",
      label: "Last name",
    },
    {
      name: "email",
      label: "Email",
    },
    {
      name: "tags",
      label: "Tags",
    },
    ...additional_columns,
  ];

  const options = {
    filterType: "checkbox",
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
          page: 1,
          page_size: 10000, // FIXME: this should be pageSize
        },
      })
      .then((res) => {
        console.log("FETCHED:", res.data);
        setConstituents([...res.data.constituents]);
        setAdditionalColumns(res.data.meta.additional_columns);
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
        <MUIDataTable
          data={constituents}
          columns={columns}
          loading={loading}
          options={options}
        />
      </Card>
    </Container>
  );
}
