import * as React from 'react';
import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios'
import { Button, Grid } from '@mui/material'

interface Data {
  product: string,
  tags: String,
  energy: number,
  protein: number,
  fat: number,
  monounsaturatedFat: number,
  polyunsaturatedFat: number,
  carbohydrate: number,
  sugar: number,
  transFat: number,
  dietaryfibre: number,
  sodium: number,
  potassium: number,
  calcium: number,
  vitamine: number,
}

function createData(
  product: string,
  tags: String,
  energy: number,
  protein: number,
  fat: number,
  monounsaturatedFat: number,
  polyunsaturatedFat: number,
  carbohydrate: number,
  sugar: number,
  transFat: number,
  dietaryfibre: number,
  sodium: number,
  potassium: number,
  calcium: number,
  vitamine: number,
): Data {
  return {
    product,
    tags,
    energy,
    protein,
    fat,
    monounsaturatedFat,
    polyunsaturatedFat,
    carbohydrate,
    sugar,
    transFat,
    dietaryfibre,
    sodium,
    potassium,
    calcium,
    vitamine
  };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'product',
    numeric: false,
    disablePadding: true,
    label: 'Product',
  },
  {
    id: 'tags',
    numeric: false,
    disablePadding: false,
    label: 'tags',
  },
  {
    id: 'energy',
    numeric: true,
    disablePadding: false,
    label: 'energy',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'protein',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'fat',
  },
  
  {
    id: 'monounsaturatedFat',
    numeric: true,
    disablePadding: false,
    label: 'monounsaturatedFat',
  },
  
  {
    id: 'polyunsaturatedFat',
    numeric: true,
    disablePadding: false,
    label: 'polyunsaturatedFat',
  },
  
  {
    id: 'carbohydrate',
    numeric: true,
    disablePadding: false,
    label: 'carbohydrate',
  },
  
  {
    id: 'sugar',
    numeric: true,
    disablePadding: false,
    label: 'Sugar',
  },
  
  {
    id: 'transFat',
    numeric: true,
    disablePadding: false,
    label: 'transFat',
  },
  
  {
    id: 'dietaryfibre',
    numeric: true,
    disablePadding: false,
    label: 'dietaryFibre',
  },
  {
    id: 'sodium',
    numeric: true,
    disablePadding: false,
    label: 'sodium',
  },
  {
    id: 'potassium',
    numeric: true,
    disablePadding: false,
    label: 'potassium',
  },
  {
    id: 'calcium',
    numeric: true,
    disablePadding: false,
    label: 'calcium',
  },
  {
    id: 'vitamine',
    numeric: true,
    disablePadding: false,
    label: 'vitamin-e',
  },

];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow style={{ backgroundColor: "grey" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ textAlign: "center", color: "white" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}


const ProductsTable: React.FC = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('product');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [products, setproducts] = React.useState([]);
  const [Selectedproductsdata, setSelectedproductsdata] = React.useState([])
  const [rows, setrows] = React.useState([])
  const [upperrow, setupperrow] = React.useState(<></>)
  const [buttondata, setbuttondata] = React.useState("SELECT 2 PRODUCT TO COMPARE")
  const [disable, setdisable] = React.useState(true)
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  const comparedata = () => {
    showupperrow()
  }
  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Nutrition
          </Typography>
        )}
        <Button disabled={disable} variant="contained" style={{ width: "400px", backgroundColor: "grey",color:"whitey" }} id="mybtn" onClick={comparedata}>{buttondata}</Button>

      </Toolbar>
    );
  };
  useEffect(() => {
    var productdata = []
    var productnamedata = []
    axios.get("http://localhost:3000/api/products").then(res => {
      setproducts(res.data)
      res.data.map(data => {
        var item = createData(data.name, data.tags, data.nutrition.energy, data.nutrition.protein, data.nutrition.fat, data.nutrition.monounsaturatedFat, data.nutrition.polyunsaturatedFat, data.nutrition.carbohydrate, data.nutrition.sugar, data.nutrition.transFat, data.nutrition.dietaryFibre, data.nutrition.sodium, data.nutrition.potassium, data.nutrition.calcium, data.nutrition["vitamin-e"])
        productnamedata.push(data.id)
        productdata.push({...data.name, ...data.tags, ...data.nutrition.energy, ...data.nutrition.protein, ...data.nutrition.fat, ...data.nutrition.monounsaturatedFat, ...data.nutrition.polyunsaturatedFat, ...data.nutrition.carbohydrate, ...data.nutrition.sugar, ...data.nutrition.transFat, ...data.nutrition.dietaryFibre, ...data.nutrition.sodium, ...data.nutrition.potassium, ...data.nutrition.calcium, ...data.nutrition["vitamin-e"]})
      })
      setrows(productdata)
      })
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const backgroundcolordata = (data1:number, data2:number) => {
    if (data1 > data2) {
      return "blue"
    }
    if (data1 < data2) {
      return "red"
    }
    if (data2 == undefined) {
      return "grey"
    }
    else return "yellow"
  }

  const rowcolor=(data1:string)=>{
    if(selected.indexOf(data1)==-1){
      return("rgb(77, 77, 77)")
    }
    else{
      return("#955073")
    }
  }
  const showupperrow = () => {
    setupperrow(<>
      <TableCell align="right">
        <Grid item xs={1.5}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px" }}>{Selectedproductsdata[0].name}</h4><h4>{Selectedproductsdata[1].name}</h4></> : <></>}
        </Grid>
      </TableCell>
      <TableCell align="right">
        <Grid item xs={1.5}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px" }}>{Selectedproductsdata[0].tags}</h4><h4>{Selectedproductsdata[1].tags}</h4></> : <></>}
        </Grid>
      </TableCell>
      <TableCell align="right">
        <Grid item xs={.7}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.energy, Selectedproductsdata[1].nutrition.energy), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.energy}</h4 ><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.energy, Selectedproductsdata[0].nutrition.energy), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.energy}</h4></> : <></>}
        </Grid>
      </TableCell>
      <TableCell align="right">
        <Grid item xs={.7}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.protein, Selectedproductsdata[1].nutrition.protein), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.protein}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.protein, Selectedproductsdata[0].nutrition.protein), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.protein}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={.8}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.fat, Selectedproductsdata[1].nutrition.fat), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.fat}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.fat, Selectedproductsdata[0].nutrition.fat), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.fat}</h4></> : <></>}
        </Grid></TableCell>
        <TableCell align="right">
        <Grid item xs={.8}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.monounsaturatedFat, Selectedproductsdata[1].nutrition.monounsaturatedFat), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.monounsaturatedFat}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.monounsaturatedFat, Selectedproductsdata[0].nutrition.monounsaturatedFat), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.monounsaturatedFat}</h4></> : <></>}
        </Grid></TableCell>
        <TableCell align="right">
        <Grid item xs={.8}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.polyunsaturatedFat, Selectedproductsdata[1].nutrition.polyunsaturatedFat), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.polyunsaturatedFat}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.polyunsaturatedFat, Selectedproductsdata[0].nutrition.polyunsaturatedFat), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.polyunsaturatedFat}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={.8}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.carbohydrate, Selectedproductsdata[1].nutrition.carbohydrate), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.carbohydrate}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.carbohydrate, Selectedproductsdata[0].nutrition.carbohydrate), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.carbohydrate}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={1}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.sugar, Selectedproductsdata[1].nutrition.sugar), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.sugar}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.sugar, Selectedproductsdata[0].nutrition.sugar), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.sugat}</h4></> : <></>}
        </Grid></TableCell>
        <TableCell align="right">
        <Grid item xs={.8}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.transFat, Selectedproductsdata[1].nutrition.transFat), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.transFat}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.transFat, Selectedproductsdata[0].nutrition.transFat), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.transFat}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={1}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.dietaryFibre, Selectedproductsdata[1].nutrition.dietaryFibre), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.dietaryFibre}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.dietaryFibre, Selectedproductsdata[0].nutrition.dietaryFibre), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.dietaryFibre}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={1}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.sodium, Selectedproductsdata[1].nutrition.sodium), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.sodium}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.sodium, Selectedproductsdata[0].nutrition.sodium), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.sodium}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={1}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.potassium, Selectedproductsdata[1].nutrition.potassium), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.potassium}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.potassium, Selectedproductsdata[0].nutrition.potassium), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.potassium}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={1}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition.calcium, Selectedproductsdata[1].nutrition.calcium), textAlign: "center" }}>{Selectedproductsdata[0].nutrition.calcium}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition.calcium, Selectedproductsdata[0].nutrition.calcium), textAlign: "center" }}>{Selectedproductsdata[1].nutrition.calcium}</h4></> : <></>}
        </Grid></TableCell>
      <TableCell align="right">
        <Grid item xs={.5}>
          {Selectedproductsdata[0] != undefined ? <><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[0].nutrition["vitamin-e"], Selectedproductsdata[1].nutrition["vitamin-e"]), textAlign: "center" }}>{Selectedproductsdata[0].nutrition["vitamin-e"]}</h4><h4 style={{ marginTop: "-11px",borderRadius:"20px", backgroundColor: backgroundcolordata(Selectedproductsdata[1].nutrition["vitamin-e"], Selectedproductsdata[0].nutrition["vitamin-e"]), textAlign: "center" }}>{Selectedproductsdata[1].nutrition["vitamin-e"]}</h4></> : <></>}
        </Grid>
      </TableCell></>
    )
    setdisable(true)
  }
  const handleClick = (event: React.MouseEvent<unknown>, name: string, id: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];
    if (selected.length < 2) {
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
        setSelected(newSelected);
        document.getElementById(id).style.backgroundColor = "#955073"

      }
      if (newSelected.length == 2) {
        var datadata = []
        datadata = (products.filter(function (data) {
          return newSelected.indexOf(data.name) !== -1
        }))
        setSelectedproductsdata(datadata)
        var data = [...newSelected]
        setdisable(false)
        setbuttondata("COMPARE PRODUCTS")
      }
    }

    if (selectedIndex !== -1) {
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        setSelected(newSelected);
        document.getElementById(id).style.backgroundColor = "rgb(77, 77, 77)"
        setupperrow(<></>)
        setdisable(true)
        setbuttondata("SELECT 2 PRODUCT TO COMPARE")
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        setSelected(newSelected);
        document.getElementById(id).style.backgroundColor = "rgb(77, 77, 77)"
        setupperrow(<></>)
        setdisable(true)
        setbuttondata("SELECT 2 PRODUCT TO COMPARE")
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
        setupperrow(<></>)
        setSelected(newSelected);
        document.getElementById(id).style.backgroundColor = "rgb(77, 77, 77)"
        setdisable(true)
        setbuttondata("SELECT 2 PRODUCT TO COMPARE")
      }

    }
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  


  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '80%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}
        style={{ backgroundColor: "rgb(77, 77, 77)", color: "white" }}
      >
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}

            />
            <TableBody
            >
              <TableRow>
                {upperrow}
              </TableRow>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected("row.name");
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.product, `enhanced-table-checkbox-${index}`)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      id={`enhanced-table-checkbox-${index}`}
                      style={{backgroundColor:rowcolor(row.product)}}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        style={{ color: "white" }}

                      >
                        {row.product}
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.tags}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.energy}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.protein}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.fat}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.monounsaturatedFat}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.polyunsaturatedFat}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.carbohydrate}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.sugar}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.transFat}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.dietaryfibre}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.sodium}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.potassium}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.calcium}</TableCell>
                      <TableCell align="right" style={{ color: "white" }}>{row.vitamine}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{color:"white"}}
        />
      </Paper>
     
    </Box>
  );
}
export default ProductsTable