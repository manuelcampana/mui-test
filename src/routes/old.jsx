import * as React from "react";
import { Card, Container } from "@mui/material";
import MUIDataTable from "mui-datatables";
import axios from "axios";

const { REACT_APP_JWT, REACT_APP_CONSTITUENTS_API_URL } = process.env;
axios.defaults.headers.common["Authorization"] = `Bearer ${REACT_APP_JWT}`;

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
    tableBodyHeight: "calc(100vh - 300px)",
    rowsPerPage: 1000,
    rowsPerPageOptions: [100, 1000, 10000],
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
